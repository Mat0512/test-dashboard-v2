import { useEffect, useState } from "react";
import { getYear, getMonth, getDate } from "../helper";
import { createCountingArray } from "../../utils/utils";
import monthDays from "month-days";

export const useAggregatedByTimeReports = (
    reports,
    selectedYear = 2023,
    selectedMonth,
    selectedMaxDate,
    selectedDate
) => {
    const [perDayReports, setPerDayReports] = useState([]);
    const [monthlyReports, setMonthlyReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]); // filtered by year
    const [annualReports, setAnnualReports] = useState([]);
    const [isTotalReportsLoading, setIsTotalReportLoading] = useState(false);

    useEffect(() => {
        setIsTotalReportLoading(true);
        const filteredReports = reports.filter((report) => {
            const year = getYear(report.date);
            return year == selectedYear;
        });

        setFilteredReports(filteredReports);
        setIsTotalReportLoading(false);
    }, [reports, selectedYear]);

    //months aggregation
    useEffect(() => {
        setIsTotalReportLoading(true);
        const updatedMonthly = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "July",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ].map((month) => ({ month: month, total: 0 }));

        filteredReports.forEach((reports) => {
            const month = getMonth(reports.date);
            updatedMonthly[month] = {
                ...updatedMonthly[month],
                total: updatedMonthly[month].total + 1,
            };
        });

        setMonthlyReports(updatedMonthly);
        setIsTotalReportLoading(false);

        return function cleanUp() {
            setMonthlyReports([]);
        };
    }, [reports, filteredReports]);

    //per day aggregation
    useEffect(() => {
        if (selectedMonth === "") return;

        //filter reports by selected month,
        const filteredReportsByMonth = filteredReports.filter((report) => {
            return getMonth(report.date) == selectedMonth;
        });

        //get max day of selected month
        const maxDaysoOfMonth = monthDays({
            month: selectedMonth,
            year: selectedYear,
        });

        //init var for sum of all reports in month from array of total days
        const totalReportsByMonth = createCountingArray(maxDaysoOfMonth).map(
            (day) => ({
                "First Alarm": 0,
                "Second Alarm": 0,
                "Third Alarm": 0,
                "Fourth Alarm": 0,
                "Fifth Alarm": 0,
                "Task Force Alpha": 0,
                "Task Force Bravo": 0,
                "Task Force Charlie": 0,
                "Task Force Delta, Echo, Hotel, India": 0,
                "General Alarm": 0,
                "Under Control": 0,
                "Fire Out": 0,
                day: day,
                total: 0,
            })
        );

        //adding val on monthly total reports by looping total days
        //note: the month in number is accessed by month - 1, i.e. May or 5 has index of 4
        filteredReportsByMonth.forEach((report) => {
            const dayIndex = getDate(report.date) - 1;

            totalReportsByMonth[dayIndex].total =
                totalReportsByMonth[dayIndex].total + 1;

            totalReportsByMonth[dayIndex][report.alarm] =
                totalReportsByMonth[dayIndex][report.alarm] + 1;
        });

        if (selectedDate !== "") {
            const singleDayReport = totalReportsByMonth.filter((report) => {
                return report.day == selectedDate;
            });
            setPerDayReports(singleDayReport);
            return;
        }

        if (!selectedMaxDate) {
            setPerDayReports(totalReportsByMonth);
            return;
        }

        //filter reports within max date

        const reportsWithinDateRange = totalReportsByMonth.filter((report) => {
            return report.day <= selectedMaxDate;
        });

        setPerDayReports(reportsWithinDateRange);
    }, [selectedMonth, selectedMaxDate, filteredReports, selectedDate]);

    //annually aggregation
    useEffect(() => {
        setIsTotalReportLoading(true);

        const accumulatedYears = [];

        reports.forEach((report) => {
            const year = getYear(report.date);
            accumulatedYears.push(year);
        });

        const uniqueYears = [...new Set(accumulatedYears)].sort((a, b) =>
            a > b ? 1 : a < b ? -1 : 0
        );

        const yearlyReports = uniqueYears.map((year) => ({
            "First Alarm": 0,
            "Second Alarm": 0,
            "Third Alarm": 0,
            "Fourth Alarm": 0,
            "Fifth Alarm": 0,
            "Task Force Alpha": 0,
            "Task Force Bravo": 0,
            "Task Force Charlie": 0,
            "Task Force Delta, Echo, Hotel, India": 0,
            "General Alarm": 0,
            "Under Control": 0,
            "Fire Out": 0,
            year: year,
            total: 0,
        }));

        reports.forEach((report) => {
            const year = getYear(report.date);
            const index = year - Math.min(...uniqueYears);

            yearlyReports[index].total = yearlyReports[index].total + 1;

            yearlyReports[index][report.alarm] =
                yearlyReports[index][report.alarm] + 1;
        });

        setAnnualReports(yearlyReports);
        setIsTotalReportLoading(false);

        return function cleanUp() {
            setAnnualReports([]);
        };
    }, [reports]);

    return {
        perDayReports,
        monthlyReports,
        annualReports,
        isTotalReportsLoading,
    };
};
