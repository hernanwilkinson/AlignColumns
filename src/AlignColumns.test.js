class AlignColumns {
    constructor(lines) {

    }

    value() {
        return [];
    }
}

describe('Align Columns suite', () => {
    test('Should return no lines when there are no lines with columns to align', () => {
        const alignColumns = new AlignColumns([])
        expect(alignColumns.value()).toEqual([])
    })

})