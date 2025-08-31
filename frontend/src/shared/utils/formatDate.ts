export function formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const day = date.getDate();
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const currentYear = new Date().getFullYear();
        
        return year === currentYear
            ? `${day} ${month}`
            : `${day} ${month} ${year} года`;
    } catch (e) {
        return dateString;
    }
}