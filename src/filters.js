import numeral from 'numeral'

function dollarFilter(value) {
    if (!value) {
        return '$ 0'
    }
    return numeral(value).format('($ 0.00a)')

}

const percentFilter = (value) => {
    if (!value) {
        return '0 %'
    }
    return `${Number(value).toFixed(2)} %`
}


//because maybe if I need more filters I can export any filter but not all at once
export { dollarFilter, percentFilter }