export const parseResult = (obj) => {
    const reportData = [];

    for (let id in obj) {
        reportData.push({
            id: id,
            ...obj[id],
        });
    }

    return reportData;
};

// used for parsing nested reports
export const parseReports = (reports) => {
    const reportsData = [];
    for (let reportId in reports) {
        for (let userReportId in reports[reportId]) {
            reportsData.push({
                reportId: reportId,
                userReportId: userReportId,
                ...reports[reportId][userReportId],
            });
        }
    }

    return reportsData;
};

export const getDate = (dateString) => {
    const dateObject = new Date(dateString);
    const date = dateObject.getDate();
    return date;
};

export const getMonth = (dateString) => {
    const dateObject = new Date(dateString);
    const month = dateObject.getMonth();

    return month;
};

export const getYear = (dateString) => {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    return year;
};
