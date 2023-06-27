import { Box, Typography } from "@mui/material";

const AnnualReportSummay = ({ label, report }) => {
    const keys = Object.keys(report);
    return (
        <Box p={1}>
            <Typography variant="h6">{label}</Typography>
            <Box mt="10px" display="flex" flexDirection="column" gap="5px">
                {keys
                    .filter((key) => key !== "year")
                    .map((key) =>
                        key === "total" ? (
                            <Typography key={key} mt="10px" fontSize="18px">
                                Total - {report[key]}
                            </Typography>
                        ) : (
                            <Typography
                                key={key}
                                fontSize="14px"
                            >{`${key} - ${report[key]}`}</Typography>
                        )
                    )}
            </Box>
        </Box>
    );
};

export default AnnualReportSummay;
