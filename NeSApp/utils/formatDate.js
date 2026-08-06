export function formatPublishedDate(publishedAt) {
    if (!publishedAt) return '';

    const date = new Date(publishedAt);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}