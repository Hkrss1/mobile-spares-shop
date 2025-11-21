export const validateMobileNumber = (mobile: string): { valid: boolean; error?: string } => {
    // Remove spaces and dashes
    const cleaned = mobile.replace(/[\s-]/g, '');

    // Check if it's a 10-digit number
    if (!/^\d{10}$/.test(cleaned)) {
        return { valid: false, error: 'Mobile number must be 10 digits' };
    }

    // Check if it starts with valid Indian mobile prefixes (6-9)
    if (!/^[6-9]/.test(cleaned)) {
        return { valid: false, error: 'Mobile number must start with 6, 7, 8, or 9' };
    }

    return { valid: true };
};

export const formatMobileNumber = (mobile: string): string => {
    // Remove all non-digits
    const cleaned = mobile.replace(/\D/g, '');
    // Return with +91 prefix
    return `+91${cleaned}`;
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one number' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one special character' };
    }

    return { valid: true };
};
