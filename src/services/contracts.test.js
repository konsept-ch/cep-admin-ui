import { buildDownloadFilename, deriveExtension, resolveFilename } from './contracts'

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

describe('deriveExtension', () => {
    it('maps known mime types', () => {
        expect(deriveExtension('application/pdf')).toBe('pdf')
        expect(deriveExtension('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe('docx')
    })

    it('returns subtype for unknown mappings', () => {
        expect(deriveExtension('image/png')).toBe('png')
    })

    it('ignores octet-stream', () => {
        expect(deriveExtension('application/octet-stream')).toBeNull()
    })
})

describe('buildDownloadFilename', () => {
    it('appends extension when missing', () => {
        const header = 'attachment; filename="Contrat formateur"'
        expect(
            buildDownloadFilename({
                contentDisposition: header,
                mimeType: 'application/pdf',
                fallbackBaseName: 'contrat',
            })
        ).toBe('Contrat formateur.pdf')
    })

    it('falls back to base name when header absent', () => {
        expect(
            buildDownloadFilename({
                contentDisposition: '',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                fallbackBaseName: 'contrat-123',
            })
        ).toBe('contrat-123.docx')
    })

    it('sanitizes invalid characters', () => {
        const header = 'attachment; filename="Contrat:Formateur*2025"'
        expect(
            buildDownloadFilename({
                contentDisposition: header,
                mimeType: 'application/pdf',
                fallbackBaseName: 'contrat',
            })
        ).toBe('Contrat_Formateur_2025.pdf')
    })

    it('retains existing extension', () => {
        const header = 'attachment; filename="Contrat.pdf"'
        expect(
            buildDownloadFilename({
                contentDisposition: header,
                mimeType: 'application/pdf',
                fallbackBaseName: 'contrat',
            })
        ).toBe('Contrat.pdf')
    })

    it('returns fallback without extension when mime is unknown', () => {
        expect(
            buildDownloadFilename({
                contentDisposition: null,
                mimeType: 'application/octet-stream',
                fallbackBaseName: 'contrat',
            })
        ).toBe('contrat')
    })
})
