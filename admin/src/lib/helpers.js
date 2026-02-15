// Shared helper functions

/**
 * Display speciality as comma-separated string
 * Backend sends normalized arrays, but this handles legacy string formats
 */
export const displaySpeciality = (spec) => {
    if (Array.isArray(spec)) return spec.join(', ')
    if (typeof spec === 'string' && spec.trim()) return spec
    return ''
}

/**
 * Parse speciality into array format
 * Backend sends normalized arrays, but this handles legacy formats for filtering
 */
export const parseSpeciality = (spec) => {
    if (Array.isArray(spec)) return spec
    if (typeof spec === 'string') {
        if (!spec || spec.trim() === '') return []
        try {
            const parsed = JSON.parse(spec)
            if (Array.isArray(parsed)) return parsed
            return [String(parsed)]
        } catch {
            return [spec]
        }
    }
    return []
}
