import Map from "./Map";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import { useEffect, useContext, useState } from "react";
import { ReportsContext } from "../../services/reports/useReportsData";
import { ref, set } from "firebase/database";
import { db } from "../../config/firebase";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";

// import { exportPdfChart } from "../../utils/utils";

const ReportDetails = () => {
    const { reports } = useContext(ReportsContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [matchedData, setMatchedData] = useState(null);
    const [alarm, setAlarm] = useState("");
    const [note, setNote] = useState("This report can be downloaded as pdf");
    const [isEditNote, setIsEditNote] = useState(false);

    useEffect(() => {
        if (reports.length) {
            const match = reports.filter(
                (report) => report.userReportId === id
            );
            setMatchedData(match[0]);
            setNote(match[0].note);
            setAlarm(match[0].alarm);
        }
    }, [reports]);

    const handleAlarmChange = (e) => {
        const reportRef = ref(
            db,
            `Incoming report/${matchedData.reportId}/${matchedData.userReportId}`
        );
        const updateData = { ...matchedData, alarm: e.target.value };
        set(reportRef, updateData)
            .then(() => {
                alert("Updated");
            })
            .catch((err) => alert("Error on updating"));
    };

    //notes state (not saved in database)
    const handleNoteChange = (e) => {
        setNote(e.target.value);
    };

    const editNote = () => {
        setIsEditNote(true);
    };

    const cancelEditNote = () => {
        console.log("matched: ", matchedData);
        setNote(matchedData.note);
        setIsEditNote(false);
    };

    const saveNote = () => {
        const reportRef = ref(
            db,
            `Incoming report/${matchedData.reportId}/${matchedData.userReportId}`
        );
        const updateData = { ...matchedData, note: note };
        set(reportRef, updateData)
            .then(() => {
                alert("Updated");
            })
            .catch((err) => alert("Error on updating"));

        setIsEditNote(false);
    };

    const setReportStatus = (status) => {
        const reportRef = ref(
            db,
            `Incoming report/${matchedData.reportId}/${matchedData.userReportId}`
        );
        const updateData = { ...matchedData, status: status };
        set(reportRef, updateData)
            .then(() => {
                alert("Updated");
            })
            .catch((err) => alert("Error on updating"));
    };

    return (
        <>
            {!matchedData ? (
                "loading"
            ) : (
                <div>
                    <Button
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        back to dashboard
                    </Button>

                    <Header
                        title="Report Details"
                        subtitle={
                            matchedData.status !== "pending"
                                ? matchedData.status
                                : null
                        }
                    />

                    <Typography>{`Report ID: ${matchedData.userReportId}`}</Typography>
                    <Box display="flex" gap={4}>
                        <div>
                            <Typography fontSize="14px">{`Reporter Name:  ${matchedData.fname}`}</Typography>
                            <Typography fontSize="14px">{`Address:  ${matchedData.addresss}`}</Typography>
                        </div>
                        <Box>
                            <Typography fontSize="14px">{`Reporter Contact:  ${matchedData.con}`}</Typography>
                            <Typography fontSize="14px">{`Date:  ${matchedData.date}`}</Typography>
                        </Box>
                    </Box>
                    <Map reportData={matchedData} />
                    {matchedData.status == "pending" && (
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                sx={{
                                    backgroundColor: "#c40223",
                                    color: "#fffff",
                                }}
                                variant="contained"
                                onClick={() => setReportStatus("declined")}
                            >
                                Decline
                            </Button>
                            <Button
                                sx={{
                                    background: "#48A14D",
                                    color: "white",
                                }}
                                variant="contained"
                                onClick={() => setReportStatus("responded")}
                            >
                                Respond
                            </Button>
                        </Box>
                    )}
                    <Box width="100%" py="20px">
                        {/* drop down */}
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                                Alarm
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={alarm}
                                label="Alaram"
                                onChange={handleAlarmChange}
                                defaultValue="First Alarm"
                            >
                                <MenuItem value="First Alarm">
                                    First Alarm
                                </MenuItem>
                                <MenuItem value="Second Alarm">
                                    Second Alarm
                                </MenuItem>
                                <MenuItem value="Third Alarm">
                                    Third Alarm
                                </MenuItem>
                                <MenuItem value="Fourth Alarm">
                                    Fourth Alarm
                                </MenuItem>
                                <MenuItem value="Fifth Alarm">
                                    Fifth Alarm
                                </MenuItem>
                                <MenuItem value="Task Force Alpha">
                                    Task Force Alpha
                                </MenuItem>
                                <MenuItem value="Task Force Bravo">
                                    Task Force Bravo
                                </MenuItem>
                                <MenuItem value="Task Force Charlie">
                                    Task Force Charlie
                                </MenuItem>
                                <MenuItem value="Task Force Delta, Echo, Hotel, India">
                                    Task Force Delta, Echo, Hotel, India
                                </MenuItem>
                                <MenuItem value="General Alarm">
                                    General Alarm
                                </MenuItem>
                                <MenuItem value="Under Control">
                                    Under Control
                                </MenuItem>
                                <MenuItem value="Fire Out">Fire Out</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Editable Note, toggle between input and non input element*/}
                        {isEditNote ? (
                            <TextField
                                // variant="filled"
                                fullWidth
                                sx={{ marginY: "16px" }}
                                InputProps={{
                                    endAdornment: (
                                        <>
                                            {/* cancel */}
                                            <IconButton
                                                onClick={cancelEditNote}
                                            >
                                                <DoDisturbIcon />
                                            </IconButton>
                                            {/* save */}
                                            <IconButton onClick={saveNote}>
                                                <SaveIcon />
                                            </IconButton>
                                        </>
                                    ),
                                }}
                                value={note}
                                label="Edit Note"
                                name="note"
                                onChange={handleNoteChange}
                            >
                                <Box p={1}>
                                    <p>{note}</p>
                                </Box>
                            </TextField>
                        ) : (
                            <Box
                                width="100%"
                                bgcolor="#fff"
                                boxShadow="0 0 2px rgba(0, 0, 0, 0.25)"
                                p="10px"
                                mt="20px"
                                border="none"
                                display="flex"
                                justifyContent="spaceBetween"
                                value={note}
                                label="Note"
                                name="Note"
                                onChange={handleNoteChange}
                            >
                                <Box px={1} py={2} width="100%">
                                    <Typography
                                        lineHeight="1"
                                        mb="10px"
                                        variant="h6"
                                        component="p"
                                    >
                                        Note
                                    </Typography>

                                    <p>{note}</p>
                                </Box>
                                <IconButton
                                    sx={{
                                        alignSelf: "end",
                                    }}
                                    onClick={editNote}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </div>
            )}
        </>
    );
};

export default ReportDetails;
