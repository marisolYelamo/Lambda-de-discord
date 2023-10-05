/* eslint-disable @typescript-eslint/no-explicit-any */
import { LambdaError } from "../errors";

export const requireProperties = (
  objectName = "object",
  object: any,
  requiredProperties: {
    [key: string]:
      | string[]
      | "string"
      | "number"
      | "boolean"
      | "object"
      | "array";
  }
) => {
  for (const property in requiredProperties) {
    // Checks for keys existence
    if (object[property] === undefined) {
      throw new LambdaError({
        message: `Missing required property "${property}" in "${objectName}".
        
        Got: "${Object.keys(object).join(", ")}"`,
        status: 400,
      });
    }

    // Checks for correct values
    switch (requiredProperties[property]) {
      case "string":
        if (typeof object[property] !== "string") {
          throw new LambdaError({
            message: `Wrong type for property "${property}" in "${objectName}".
            
            Expected: "string". 
            
            Got: "${typeof object[property]}"`,
            status: 400,
          });
        }
        break;

      case "number":
        if (typeof object[property] !== "number") {
          throw new LambdaError({
            message: `Wrong type for property "${property}" in "${objectName}".
            
            Expected: "number". 
            
            Got: "${typeof object[property]}"`,
            status: 400,
          });
        }
        break;

      case "boolean":
        if (typeof object[property] !== "boolean") {
          throw new LambdaError({
            message: `Wrong type for property "${property}" in "${objectName}".
            
            Expected: "boolean". 
            
            Got: "${typeof object[property]}"`,
            status: 400,
          });
        }
        break;

      case "object":
        if (typeof object[property] !== "object") {
          throw new LambdaError({
            message: `Wrong type for property "${property}" in "${objectName}".
            
            Expected: "object". 
            
            Got: "${typeof object[property]}"`,
            status: 400,
          });
        }
        break;

      case "array":
        if (!Array.isArray(object[property])) {
          throw new LambdaError({
            message: `Wrong type for property "${property}" in "${objectName}".
            
            Expected: "array". 
            
            Got: "${typeof object[property]}"`,
            status: 400,
          });
        }
        break;

      default:
        if (Array.isArray(requiredProperties[property])) {
          const validValues = requiredProperties[property] as string[];

          if (!validValues.includes(object[property])) {
            throw new LambdaError({
              message: `Wrong value for property "${property}" in "${objectName}".
              
              Valid values: ${validValues.join(", ")}. 
              
              Got: "${object[property]}"`,
              status: 400,
            });
          }
        }
        break;
    }
  }
};

export const requireAtLeastOneProperty = (
  objectName = "object",
  object: any,
  posibleProperties: {
    [key: string]: string[] | "string" | "number" | "boolean" | "object";
  }
) => {
  const hasAtLeastOneValidProperty = Object.entries(posibleProperties).some(
    ([property, value]) => {
      switch (value) {
        case "string":
          return typeof object[property] === "string";
        case "number":
          return typeof object[property] === "number";
        case "boolean":
          return typeof object[property] === "boolean";
        case "object":
          return typeof object[property] === "object";
        default:
          if (Array.isArray(posibleProperties[property])) {
            const validValues = posibleProperties[property] as string[];
            return validValues.includes(object[property]);
          }
          break;
      }
    }
  );

  if (!hasAtLeastOneValidProperty) {
    const beautifiedPosibleProperties: { [key: string]: string | string[] } = {
      ...posibleProperties,
    };

    for (const property in beautifiedPosibleProperties) {
      if (Array.isArray(beautifiedPosibleProperties[property])) {
        beautifiedPosibleProperties[property] = (
          beautifiedPosibleProperties[property] as string[]
        ).join(" | ");
      }
    }
    throw new LambdaError({
      message: `Wrong or missing at least one valid property and value in "${objectName}".
      
      Got object: 
${JSON.stringify(object, null, 2)}
      
      Valid object properties and values: 
${JSON.stringify(beautifiedPosibleProperties, null, 2)}`,
      status: 400,
    });
  }
};
