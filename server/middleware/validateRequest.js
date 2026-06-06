function validateRequest(rules) {
  return (req, res, next) => {
    const errors = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({ field: rule.field, message: rule.message || `${rule.field} is required` });
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {
          errors.push({ field: rule.field, message: rule.message || 'Invalid email address' });
        }

        if (rule.minLength && String(value).length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at least ${rule.minLength} characters`
          });
        }

        if (rule.maxLength && String(value).length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at most ${rule.maxLength} characters`
          });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', errors });
    }

    next();
  };
}

module.exports = validateRequest;