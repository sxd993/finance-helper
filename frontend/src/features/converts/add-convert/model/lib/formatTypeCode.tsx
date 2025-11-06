export const formatTypeCode = (code: string) => {
    switch (code) {
        case 'important':
            return 'Необходимые'
        case 'wishes':
            return 'Желания'
        case 'saving':
            return 'Накопления'
        case 'investment':
            return 'Инвестиции'
    }
}