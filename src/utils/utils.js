import jsPDF from "jspdf";
import { toPng } from "html-to-image";

import monthDays from "month-days";

export async function exportPdfChart(id, reportTitle) {
    const padding = 30;
    const doc = new jsPDF("l", "px");

    const element = document.getElementById(id);
    console.log("element: ", element);
    const imageData = await toPng(element);

    let elementWidth = element.offsetWidth;
    let elementHeight = element.offsetHeight;

    const pageWidth = doc.internal.pageSize.getWidth();

    console.log("element w: ", elementWidth);
    console.log("page w: ", pageWidth);

    if (elementWidth > pageWidth) {
        let ratio = pageWidth / elementWidth;
        elementHeight = elementHeight * ratio - 10;
        elementWidth = elementWidth * ratio - padding;
    }

    doc.setFontSize(24);
    doc.text(30, 50, reportTitle);
    doc.addImage(imageData, "PNG", 15, 70, elementWidth, elementHeight);
    doc.save("total_report.pdf");
}

//utils for monthly reports
export const createCountingArray = (num) => {
    var countingArray = [];

    for (var i = 1; i <= num; i++) {
        countingArray.push(i);
    }

    return countingArray;
};

export const toggleMaxMonthDays = (monthIndex, year) => {
    if (monthIndex == 2) return 16;
    return monthDays({ month: monthIndex, year: year });
};

export const getDateRange = (maxDate) => {
    const days = createCountingArray(maxDate);
    const max = Math.max(...days);

    return days.filter((day) => {
        if (day === max) return true;
        if (day === 15 && max === 16) return false;
        if (day == 30 && max > 30) return false;
        if (day % 5 === 0) return true;

        return false;
    });
};
