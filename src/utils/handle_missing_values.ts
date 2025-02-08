const handleMissingValues = (
    fields: Record<string, any>,
    requiredFields: string[]
) => {
    const missingFields = requiredFields.filter(
        (field) =>
            fields[field] === undefined ||
            fields[field] === null ||
            fields[field] === ''
    );

    return missingFields;
};

export { handleMissingValues };
