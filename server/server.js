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

const fsSync = require('fs');


try {
    fsUpper.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fsUpper.mkdirSync('uploads');
}

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const PORT =  process.env.MYPORT ? process.env.MYPORT:8000;
const MYHOST  = process.env.MYHOST ? "http://"+process.env.MYHOST+":"+PORT:"http://localhost"+":"+PORT;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
app.use('/uploads', express.static('uploads'));

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
        fsUpper.readdirSync(`uploads/${cardId}`);
    } catch (error) {
        console.error('uploads/cardid  폴더가 없어 cardid 폴더를 생성합니다.');
        fsUpper.mkdirSync(`uploads/${cardId}`);
    }

    // 이미지를 저장할 경로 및 파일 이름
    const filePath = `uploads/${cardId}/${fileName}`;
    try {
    // 이미지 데이터를 바이너리로 변환하여 파일에 저장 (동기) -> 앞에 await를 붙히면 프로세스가 안 끝남.
        writeFileAsync(filePath, fileData, 'binary');
        console.log('파일 저장 성공:', filePath); 
        res.json({fileName:fileName, filePath:filePath});
    } catch (err) {
        console.error(err);
        res.status(500).send('파일 업로드 중 오류가 발생했습니다.');
    }finally{
        res.end();
        console.log('final:', filePath); 
    }
});

app.post('/deleteFile', async (req, res) => {
    const {cardId, fileExt, fileName} = req.body;
    // 이미지를 삭제할 경로 및 파일 이름
    const filePath = `uploads/${cardId}/${fileName}`;
    try {
        // 파일이 존재하는지 확인
         const fileStats = await fs.stat(filePath);
        //const fileStats = await fs.promises.stat(filePath); 
    
        // 파일이 존재할 때만 삭제 수행
        if (fileStats.isFile()) {
            //  unlinkAsync(filePath);   // sync 밖에 안됨. 왜 안되는지 모르겠음 await넣으면 진행 안됨.
            fsUpper.unlinkSync(filePath);
            console.log('파일 삭제 성공:', filePath); 
            res.json({fileName:fileName, filePath:filePath});
        }else{
            console.error(err);
            console.log('파일 미존재 삭제 성공:', filePath); 
            res.json({fileName:fileName, filePath:filePath});
        }
    } catch (err) {
        console.error(err);
        console.log('파일 미존재 삭제 성공:', filePath); 
        res.json({fileName:fileName, filePath:filePath});
      //  res.status(500).send('파일 삭제 중 오류가 발생했습니다.');
    }finally{
        res.end();
        console.log('final:', filePath); 
    }
});

// home  test
app.get('/', (req, res)=>{
    res.send("Service is started");
});


//login
app.post('/login', async(req, res) => {
    console.log('login');
    const {email, password} = req.body;
    try{
        const users = await pool.query('SELECT * FROM user_account WHERE email = $1', [email]);
        if(!users.rows.length) return res.json({message:'Invalid email or password'});

        const success = await bcrypt.compare(password, users.rows[0].password);
        const token = jwt.sign({email}, 'secret', {expiresIn:'1hr'});
        if(success){
            console.log("success");
            res.json({'userId' : users.rows[0].id,'userName' : users.rows[0].username, token});
        }else{
            console.log("fail");
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
app.post('/getauditjob', async(req, res) => {
    
    const { userName, 
        detectPrivacy,
        sendTimeFrom,
        sendTimeTo } = req.body;   
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
            from tbl_audit_job_log
            where user_name like $1
            and detect_privacy = $2
            and send_time >= $3
            and send_time <= $4`,
        [userName, 
            detectPrivacy,
            sendTimeFrom,
            sendTimeTo
        ]);
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



app.listen(PORT, ()=> {
    console.log(`Server running on PORT ${PORT}`);
});