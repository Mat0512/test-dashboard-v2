import React, { useState, useContext, useRef, useEffect } from "react";
import { useAggregatedByTimeReports } from "../../services/reports/useAggregatedByTimeReport";
import { ReportsContext } from "../../services/reports/useReportsData";
import Header from "../../components/Header";
import {
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Box,
    Button,
} from "@mui/material";
import BarChart from "./BarChart";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    exportPdfChart,
    toggleMaxMonthDays,
    getDateRange,
    createCountingArray,
} from "../../utils/utils";
import AnnualReportSummay from "./AnnualReportSummay";

const Reports = () => {
    const { reports } = useContext(ReportsContext);
    const [selectedYear, setSelectedYear] = useState(2023);
    const [selectedMonth, setSelectedMonth] = useState(""); // jan - march only, 1 = january, 5 = feb and so on
    const [selectedMaxDate, setSelectedMaxDate] = useState(""); // date range
    const [selectedDate, setSelectedDate] = useState(""); // single date

    const [dateSelection, setDateSelection] = useState([]);

    const stackedBarKeys = [
        "First Alarm",
        "Second Alarm",
        "Third Alarm",
        "Fourth Alarm",
        "Fifth Alarm",
        "Task Force Alpha",
        "Task Force Bravo",
        "Task Force Charlie",
        "Task Force Delta, Echo, Hotel, India",
        "General Alarm",
        "Under Control",
        "Fire Out",
    ];

    const {
        perDayReports,
        monthlyReports,
        annualReports,
        isTotalReportsLoading,
    } = useAggregatedByTimeReports(
        reports,
        selectedYear,
        selectedMonth,
        selectedMaxDate,
        selectedDate
    );

    // update date range
    useEffect(() => {
        if (selectedMonth === "") return;

        let maxDate = toggleMaxMonthDays(selectedMonth, selectedYear);
        const range = getDateRange(maxDate);
        console.log("range: ", range);
        setDateSelection(range);
    }, [selectedYear, selectedMonth]);

    return (
        <>
            {isTotalReportsLoading ? (
                "loading..."
            ) : (
                <Box width="100%" display="flex" flexDirection="column" gap={1}>
                    <Box
                        width="100%"
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Header title="Yearly Reports" />
                        <Button
                            variant="contained"
                            onClick={() => {
                                exportPdfChart(
                                    "yearly-chart-id",
                                    "Yearly Reports"
                                );
                            }}
                        >
                            <FileDownloadIcon />
                            Download
                        </Button>
                    </Box>
                    <Box
                        height="450px"
                        p="10px"
                        backgroundColor="#f2f3f5"
                        border={1}
                        borderColor="#d3d3d3"
                        borderRadius="10px"
                        id="yearly-chart-id"
                    >
                        <BarChart
                            data={annualReports}
                            keys={stackedBarKeys}
                            index="year"
                            narrowChart
                        />
                    </Box>

                    {/* Annual Report Summary */}
                    <Box display="flex" justifyContent="space-between">
                        {annualReports.map((report) => (
                            <AnnualReportSummay
                                key={report.year}
                                label={report.year}
                                report={report}
                            />
                        ))}
                    </Box>

                    {/* Monthly Report Section*/}
                    <Header title="Monthly Reports" />
                    <Box
                        width="100%"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-end"
                    >
                        {/* year selection */}
                        <div>
                            <FormControl
                                variant="filled"
                                sx={{ m: 1, width: "150px" }}
                            >
                                <InputLabel id="demo-simple-select-filled-label">
                                    Year
                                </InputLabel>
                                <Select
                                    value={selectedYear}
                                    onChange={(e) => {
                                        setSelectedYear(e.target.value);
                                    }}
                                >
                                    <MenuItem value={2021}>2021</MenuItem>
                                    <MenuItem value={2022}>2022</MenuItem>
                                    <MenuItem value={2023}>2023</MenuItem>
                                </Select>
                            </FormControl>
                            {/* month selection , limited to Jan 1 - Mar 16 only*/}
                            {/* month */}
                            <FormControl
                                variant="filled"
                                sx={{ m: 1, width: "150px" }}
                                disabled={monthlyReports.length === 0}
                            >
                                <InputLabel id="demo-simple-select-filled-label">
                                    Month
                                </InputLabel>
                                <Select
                                    value={selectedMonth}
                                    onChange={(e) => {
                                        setSelectedMonth(e.target.value);
                                    }}
                                >
                                    <MenuItem value={""}>-</MenuItem>
                                    <MenuItem value={0}>January</MenuItem>
                                    <MenuItem value={1}>February</MenuItem>
                                    <MenuItem value={2}>March</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl
                                variant="filled"
                                sx={{ m: 1, width: "150px" }}
                                // disabled={selectedMonth == ""}
                                disabled={selectedMonth === ""}
                            >
                                <InputLabel id="demo-simple-select-filled-label">
                                    Date Range
                                </InputLabel>
                                <Select
                                    value={selectedMaxDate}
                                    onChange={(e) => {
                                        setSelectedMaxDate(e.target.value);
                                        setSelectedDate("");
                                    }}
                                >
                                    <MenuItem value={""}>-</MenuItem>

                                    {dateSelection.map((day, index) => {
                                        return (
                                            <MenuItem
                                                key={day}
                                                value={day}
                                            >{`1-${day} days`}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl
                                variant="filled"
                                sx={{ m: 1, width: "150px" }}
                                disabled={selectedMonth === ""}
                            >
                                <InputLabel id="demo-simple-select-filled-label">
                                    Choose Date
                                </InputLabel>
                                <Select
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);
                                        setSelectedMaxDate("");
                                    }}
                                >
                                    <MenuItem value={""}>-</MenuItem>
                                    {createCountingArray(
                                        Math.max(...dateSelection)
                                    ).map((day) => (
                                        <MenuItem key={day} value={day + ""}>
                                            {day}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <Button
                            sx={{
                                height: "40px",
                                mb: "10px",
                            }}
                            variant="contained"
                            onClick={() => {
                                exportPdfChart(
                                    "monthly-chart-id",
                                    "Monthly Reports"
                                );
                            }}
                        >
                            <FileDownloadIcon />
                            Download
                        </Button>
                    </Box>
                    <Box
                        id="monthly-chart-id"
                        height="400px"
                        p="10px"
                        backgroundColor="#f2f3f5"
                        border={1}
                        borderColor="#d3d3d3"
                        borderRadius="10px"
                    >
                        <BarChart
                            data={
                                selectedMaxDate !== "" || selectedMonth !== ""
                                    ? perDayReports
                                    : monthlyReports
                            }
                            keys={selectedDate && stackedBarKeys}
                            index={
                                selectedMaxDate !== "" ||
                                selectedMonth !== "" ||
                                selectedDate !== ""
                                    ? "day"
                                    : "month"
                            }
                            narrowChart={selectedDate !== ""}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Reports;
