export const formatTypeCode = (code: string) => {
    switch (code) {
        case 'important':
            return 'Необходимые желания'
        case 'wishes':
            return 'Желания'
        case 'saving':
            return 'Накопления'
        case 'investements':
            return 'Инвестиции'
    }
}