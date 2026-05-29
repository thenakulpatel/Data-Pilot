export function validateSqlName(
  name: string,
  existingNames: string[]
) {

  if (!name.trim()) {

    return {
      valid: false,
      error:
        "Field name required",
    };
  }

  if (name.length > 50) {

    return {
      valid: false,
      error:
        "Maximum length is 50",
    };
  }

  if (name === "id") {

    return {
      valid: false,
      error:
        '"id" is reserved',
    };
  }

  if (
    name !==
    name.toLowerCase()
  ) {

    return {
      valid: false,
      error:
        "Field name must be lowercase",
    };
  }

  if (
    !/^[a-z]/.test(name)
  ) {

    return {
      valid: false,
      error:
        "Must start with a letter",
    };
  }

  if (
    !/^[a-z0-9_]+$/.test(name)
  ) {

    return {
      valid: false,
      error:
        "Only lowercase letters, numbers and underscores allowed",
    };
  }

  const duplicates =
    existingNames.filter(
      (field) =>
        field === name
    );

  if (
    duplicates.length > 1
  ) {

    return {
      valid: false,
      error:
        "Duplicate field name",
    };
  }

  return {
    valid: true,
  };
}