export const validateFieldSchema=(input:any)=> {
  const errors = [];

  // Validate label
  if (typeof input.label !== "string" || input.label.trim() === "") {
    errors.push("label is required and must be a non-empty string.");
  }

  // Validate name
  if (typeof input.name !== "string" || input.name.trim() === "") {
    errors.push("name is required and must be a non-empty string.");
  }

  // Validate type
  const allowedTypes = ["text", "number", "select", "date"];
  if (!allowedTypes.includes(input.type || "text")) {
    errors.push(`type must be one of: ${allowedTypes.join(", ")}.`);
  }

  // Validate possibleValues
  if (input.possibleValues !== undefined) {
    if (!Array.isArray(input.possibleValues)) {
      errors.push("possibleValues must be an array of strings.");
    } else if (!input.possibleValues.every((v:any) => typeof v === "string")) {
      errors.push("possibleValues must contain only strings.");
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}