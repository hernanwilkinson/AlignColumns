class AlignColumns {
    _lines;

    constructor(lines) {
        this._lines = lines;
    }

    value() {
        return this._lines.map(line => [line[0] + ' '.repeat((this._lines[0])[0].length - line[0].length)])
    }
}

describe('Align Columns suite', () => {
    test('Should return no lines when there are no lines with columns to align', () => {
        const alignColumns = new AlignColumns([])
        expect(alignColumns.value()).toEqual([])
    })

    test('Should return the line with the column when there is one line and column', () => {
        const alignColumns = new AlignColumns([['1234']])
        expect(alignColumns.value()).toEqual([['1234']])
    })

    test('Should return lines with its columns for same column size', () => {
        const alignColumns = new AlignColumns([['1234'],['abcd']])
        expect(alignColumns.value()).toEqual([['1234'],['abcd']])
    })

    test('Columns of different lines should have the same width', () => {
        const alignColumns = new AlignColumns([['1234'],['12']])
        expect(alignColumns.value()).toEqual([['1234'],['12  ']])
    })

})