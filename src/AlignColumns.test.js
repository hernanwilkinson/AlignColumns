class AlignColumns {
    _lines;

    constructor(lines) {
        this._lines = lines;
    }

    value() {
        if(this._lines.length==0)
            return []
        if(this._lines.length==1)
            return [[(this._lines[0])[0]]];
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
})