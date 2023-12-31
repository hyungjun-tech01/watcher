const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// multer 미들웨어 사용
const multer = require('multer');
const fsUpper = require('fs');
const path = require('path');

//const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // fs.promises를 사용하여 비동기 파일 작업을 수행합니다.
const util = require('util');

const ImageLog = "ImageLog";
const TextLog = "TextLog";

try {
    fsUpper.readdirSync(ImageLog);
} catch (error) {
    console.error(`${ImageLog} 폴더가 없어 ${ImageLog} 폴더를 생성합니다.`);
    fsUpper.mkdirSync(ImageLog);
}

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const PORT =  process.env.MYPORT ? process.env.MYPORT:8000;
const MYHOST  = process.env.MYHOST ? "http://"+process.env.MYHOST+":"+PORT:"http://localhost"+":"+PORT;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
app.use(`/${ImageLog}`, express.static(ImageLog));
app.use(`/${ImageLog}`, express.static(TextLog));

// util.promisify를 사용하여 fs.writeFile을 프로미스로 변환합니다.
const writeFileAsync = util.promisify(fs.writeFile);

// promisify를 사용하여 fs.unlink를 비동기 함수로 변환
// const unlinkAsync = util.promisify(fs.unlink);
const unlinkSync = fs.unlink;

// 동적요청에 대한 응답을 보낼때 etag 를 생성하지 않도록
app.set('etag', false);

// 정적요청에 대한 응답을 보낼때 etag 생성을 하지 않도록
const options = { etag : false };

app.post('/upload', upload.single('file'),async (req, res) => {
    const cardId = req.body.cardId;
    const file_ext = req.body.fileExt;
    const fileData = req.file.buffer; // 이미지 데이터가 여기에 들어온다고 가정합니다.
    const fileName = req.body.fileName;

    // /카드 id 폴더가 없으면 생성 
    try {
        fsUpper.readdirSync(`${ImageLog}/${cardId}`);
    } catch (error) {
        console.error('ImageLog/cardid  폴더가 없어 cardid 폴더를 생성합니다.');
        fsUpper.mkdirSync(`${ImageLog}/${cardId}`);
    }

    // 이미지를 저장할 경로 및 파일 이름
    const filePath = `${ImageLog}/${cardId}/${fileName}`;
    try {
    // 이미지 데이터를 바이너리로 변환하여 파일에 저장 (동기) -> 앞에 await를 붙히면 프로세스가 안 끝남.
        writeFileAsync(filePath, fileData, 'binary');
        res.json({fileName:fileName, filePath:filePath});
    } catch (err) {
        console.error(err);
        res.status(500).send('파일 업로드 중 오류가 발생했습니다.');
    }finally{
        res.end();
    }
});


// home  test
app.get('/', (req, res)=>{
    res.send("Service is started");
});

//login
app.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try{
        const users = await pool.query('SELECT * FROM user_account WHERE email = $1', [email]);
        if(!users.rows.length) return res.json({message:'Invalid email or password'});

        const success = await bcrypt.compare(password, users.rows[0].password);
        const token = jwt.sign({email}, 'secret', {expiresIn:'1hr'});
        if(success){
            res.json({'userId' : users.rows[0].id,'userName' : users.rows[0].username, token});
        }else{
            res.json({message:"Invalid email or password"});
        }
        res.end();
    }catch(err){
        console.error(err);
        res.json({message:err});        
        res.end();
    }
});

// query audit job log
app.get('/getAllAuditJob', async(req, res) => {
    try{
        const auditJob = await pool.query(` 
            select job_log_id as "jobLogId",
            job_type as "jobType",
            printer_serial_number as "printerSerialNumber",
            job_id   as "jobId"   ,
            user_name as "userName",
            destination as "destination",
            send_time as "sendTime",
            file_name as "fileName",
            finish_time  as "finishTime",
            copies as "copies" ,
            original_pages as "originalPages",
            detect_privacy  as "detectPrivacy",
            privacy_text as "privacyText",
            image_archive_path as "imageArchivePath",
            text_archive_path as "textArchivePath",
            origina_job_id   as "originaJobId" 
            from tbl_audit_job_log`);
        res.json(auditJob.rows);
        res.end();
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/getauditjob', async(req, res) => {
    
    const { userName, 
        detectPrivacy,
        sendTimeFrom,
        sendTimeTo } = req.body;
    const transferDetectprivacy = detectPrivacy? true:null;    
    console.log('Input Value : ', userName, detectPrivacy, sendTimeFrom, sendTimeTo);
    try{
        const auditJob = await pool.query(` 
            select job_log_id as "jobLogId",
                job_type as "jobType",
                printer_serial_number as "printerSerialNumber",
                job_id   as "jobId"   ,
                user_name as "userName",
                destination as "destination",
                send_time as "sendTime",
                file_name as "fileName",
                finish_time  as "finishTime",
                copies as "copies" ,
                original_pages as "originalPages",
                detect_privacy  as "detectPrivacy",
                privacy_text as "privacyText",
                image_archive_path,
                text_archive_path,
                origina_job_id   as "originaJobId",
                $5||'/ImageLog/'||image_archive_path as "imageArchivePath",
                $5||'/TextLog/'||text_archive_path as "textArchivePath"
            from tbl_audit_job_log
            where user_name like '%'||$1||'%'
                and detect_privacy = COALESCE($2, detect_privacy)
                and send_time >= $3
                and send_time <= $4`,
            [userName, transferDetectprivacy, sendTimeFrom, sendTimeTo, MYHOST]
        ) ;
        // : await pool.query(` 
        //     select job_log_id as "jobLogId",
        //     job_type as "jobType",
        //     printer_serial_number as "printerSerialNumber",
        //     job_id   as "jobId"   ,
        //     user_name as "userName",
        //     destination as "destination",
        //     send_time as "sendTime",
        //     file_name as "fileName",
        //     finish_time  as "finishTime",
        //     copies as "copies" ,
        //     original_pages as "originalPages",
        //     detect_privacy  as "detectPrivacy",
        //     privacy_text as "privacyText",
        //     image_archive_path as "imageArchivePath",
        //     text_archive_path as "textArchivePath",
        //     origina_job_id   as "originaJobId" 
        //     from tbl_audit_job_log
        //     where detect_privacy = $1
        //         and send_time >= $2
        //         and send_time <= $3`,
        //     [detectPrivacy, sendTimeFrom, sendTimeTo]
        // );
        res.json(auditJob.rows);
        res.end();
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

//signup 계정 생성 
app.post('/signup', async(req, res) => {
    const {createrId , 
        userActionType , 
        userName , 
        name , 
        userId ,
        email ,
        isAdmin,
        password , 
        phone , 
        organization , 
        subscribeToOwnCards,
        language ,
        avatar ,
        detail ,
           } = req.body;    
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    try{
        const signUp = await pool.query(`call p_modify_user($1, $2, $3, $4, 
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
            $19)` ,
        [createrId , 
            userActionType , 
            userName , 
            name , 
            userId ,
            email ,
            isAdmin,
            hashPassword , 
            phone , 
            organization , 
            subscribeToOwnCards,
            language ,
            avatar ,
            detail ,
            null,
            null,
            null,
            null,
            null
        ]);
        const outUserId = signUp.rows[0].x_user_id;
        const outCreatedAt = signUp.rows[0].x_created_at;

        res.json({outUserId:outUserId, userName:userName, outCreatedAt:outCreatedAt});
    }catch(err){
        console.error(err);
        if(err){
            res.json({message:err});
        }
    }
});

//pdf file 연결
app.get(`/${ImageLog}/:year/:month/:fileName`, function(req, res) {
    const year = req.params.year;
    const month = req.params.month;
    const fileName = req.params.fileName;
    const filePath = path.join('ImageLog', year, month, fileName);

    if (fsUpper.existsSync(filePath)) {
        res.contentType("application/pdf");
        fsUpper.createReadStream(filePath).pipe(res);
    } else {
        res.status(500);
        console.log('File not found');
        res.send('File not found');
    };
});

//txt file 연결
app.get(`/${TextLog}/:year/:month/:fileName`, function(req, res) {
    const year = req.params.year;
    const month = req.params.month;
    const fileName = req.params.fileName;
    const filePath = path.join('ImageLog', year, month, fileName);

    if (fsUpper.existsSync(filePath)) {
        res.contentType("application/text charset=utf8");
        fsUpper.createReadStream(filePath).pipe(res);
    } else {
        res.status(500);
        console.log('File not found');
        res.send('File not found');
    };
});

app.listen(PORT, ()=> {
    console.log(`Server running on PORT ${PORT}`);
});