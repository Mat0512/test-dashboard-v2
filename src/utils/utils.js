import jsPDF from "jspdf";
import { toPng } from "html-to-image";

import monthDays from "month-days";

export async function exportPdfChart(id, reportTitle, userFullName) {
    const padding = 30;
    const doc = new jsPDF("l", "px");
    const element = document.getElementById(id); // get chart dom then converts to image

    const imageData = await toPng(element);

    let elementWidth = element.offsetWidth;
    let elementHeight = element.offsetHeight;

    const pageWidth = doc.internal.pageSize.getWidth();

    if (elementWidth > pageWidth) {
        let ratio = pageWidth / elementWidth;
        elementHeight = elementHeight * ratio - 10;
        elementWidth = elementWidth * ratio - padding;
    }

    doc.setFontSize(16);
    doc.text(15, 50, reportTitle);
    doc.setFontSize(14);
    doc.text(15, 65, `Generated by: ${userFullName}`);

    doc.addImage(imageData, "PNG", 15, 75, elementWidth, elementHeight);
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

export const getDateTime = () => {
    const currentDate = new Date();

    // Get the individual components of the date and time
    const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    const day = currentDate.getDate();
    const year = currentDate.getFullYear() % 100; // Get the last two digits of the year
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the date
    const formattedDate = `${month}/${day}/${year.toString().padStart(2, "0")}`;

    // Format the time
    let formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Add the "am" or "pm" suffix
    const amPm = hours >= 12 ? "pm" : "am";
    formattedTime = formattedTime + " " + amPm;

    // Combine the formatted date and time
    const formattedDateTime = `${formattedDate}, ${formattedTime}`;

    return formattedDateTime;
};
