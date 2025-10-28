import { resolveFilename } from './contracts'

describe('resolveFilename', () => {
    it('returns null when header is missing', () => {
        expect(resolveFilename(null)).toBeNull()
        expect(resolveFilename('')).toBeNull()
    })

    it('extracts simple filename directive', () => {
        expect(resolveFilename('attachment; filename="contract.pdf"')).toBe('contract.pdf')
    })

    it('extracts UTF-8 encoded filename directive', () => {
        const header = "attachment; filename*=UTF-8''Contrat%20formateur%20%C3%89cole.pdf"
        expect(resolveFilename(header)).toBe('Contrat formateur École.pdf')
    })

    it('falls back to raw value if decoding fails', () => {
        const header = "attachment; filename*=UTF-8''Contrat%ZZ"
        expect(resolveFilename(header)).toBe('Contrat%ZZ')
    })
})
