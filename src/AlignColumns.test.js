class AlignColumns {
    _lines;

    constructor(lines) {
        this._lines = lines;
    }

    value() {
        const maxColumnSizes = (this._lines[0]??[]).map( (_,columnIndex) => this.maxColumnSizeAt(columnIndex))

        return this._lines.map(line =>
            (this._lines[0]??[]).map( (_,columnIndex) =>
                line[columnIndex] + ' '.repeat(maxColumnSizes[columnIndex] - line[columnIndex].length)))
    }

    maxColumnSizeAt(columnIndex) {
        return Math.max(0, ...this._lines.map(line => line[columnIndex].length));
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

    test('Max column width can be in any line', () => {
        const alignColumns = new AlignColumns([['12'],['1234']])
        expect(alignColumns.value()).toEqual([['12  '],['1234']])
    })

    test('Align lines with more than one column', () => {
        const alignColumns = new AlignColumns([['12','abc'],['1234','ab']])
        expect(alignColumns.value()).toEqual([['12  ','abc'],['1234','ab ']])
    })

    test('Lines can have different number of columns', () => {
        const alignColumns = new AlignColumns([['12','abc'],['1234']])
        expect(alignColumns.value()).toEqual([['12  ','abc'],['1234','   ']])
    })
})