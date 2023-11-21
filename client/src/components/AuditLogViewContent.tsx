import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function AuditLogViewContent(){
    return (
        <>
        <Stack spacing={2} direction="row">
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                >
            <TextField id="outlined-basic" label="사용자명" variant="outlined" />
            </Box>
            <Button variant="contained">조회</Button>
        </Stack>
        </>
    );
}
export default AuditLogViewContent;