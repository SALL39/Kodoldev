-- Create function to validate vaccination entry structure
CREATE OR REPLACE FUNCTION validate_vaccination_entry(entry jsonb)
RETURNS boolean AS $$
BEGIN
  RETURN (
    entry ? 'id' AND
    entry ? 'name' AND
    entry ? 'date' AND
    entry ? 'veterinarian' AND
    (NOT entry ? 'next_date' OR jsonb_typeof(entry->'next_date') IN ('string', 'null'))
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to validate medical entry structure
CREATE OR REPLACE FUNCTION validate_medical_entry(entry jsonb)
RETURNS boolean AS $$
BEGIN
  RETURN (
    entry ? 'id' AND
    entry ? 'type' AND
    entry ? 'date' AND
    entry ? 'description' AND
    entry ? 'veterinarian' AND
    (entry->>'type')::text IN ('checkup', 'treatment', 'surgery', 'other')
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to validate entire health record
CREATE OR REPLACE FUNCTION validate_health_record()
RETURNS trigger AS $$
DECLARE
  vaccination jsonb;
  medical_entry jsonb;
BEGIN
  -- Validate vaccination history entries
  IF NEW.vaccination_history IS NOT NULL THEN
    FOR vaccination IN SELECT * FROM jsonb_array_elements(NEW.vaccination_history)
    LOOP
      IF NOT validate_vaccination_entry(vaccination) THEN
        RAISE EXCEPTION 'Invalid vaccination entry structure';
      END IF;
    END LOOP;
  END IF;

  -- Validate medical history entries
  IF NEW.medical_history IS NOT NULL THEN
    FOR medical_entry IN SELECT * FROM jsonb_array_elements(NEW.medical_history)
    LOOP
      IF NOT validate_medical_entry(medical_entry) THEN
        RAISE EXCEPTION 'Invalid medical entry structure';
      END IF;
    END LOOP;
  END IF;

  -- Validate genetic info
  IF NEW.genetic_info IS NOT NULL AND NOT (NEW.genetic_info ? 'breed') THEN
    RAISE EXCEPTION 'Genetic info must include breed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_health_record_trigger ON health_records;
CREATE TRIGGER validate_health_record_trigger
  BEFORE INSERT OR UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION validate_health_record();

-- Create function to sort entries by date
CREATE OR REPLACE FUNCTION sort_health_record_entries()
RETURNS trigger AS $$
BEGIN
  -- Sort vaccination history by date descending
  IF NEW.vaccination_history IS NOT NULL THEN
    NEW.vaccination_history = (
      SELECT jsonb_agg(entry ORDER BY (entry->>'date') DESC)
      FROM jsonb_array_elements(NEW.vaccination_history) entry
    );
  END IF;

  -- Sort medical history by date descending
  IF NEW.medical_history IS NOT NULL THEN
    NEW.medical_history = (
      SELECT jsonb_agg(entry ORDER BY (entry->>'date') DESC)
      FROM jsonb_array_elements(NEW.medical_history) entry
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sorting
DROP TRIGGER IF EXISTS sort_health_record_entries_trigger ON health_records;
CREATE TRIGGER sort_health_record_entries_trigger
  BEFORE INSERT OR UPDATE ON health_records
  FOR EACH ROW
  EXECUTE FUNCTION sort_health_record_entries();