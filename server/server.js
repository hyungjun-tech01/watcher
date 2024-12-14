const crypto = require('crypto');

const express = require('express');
const app = express();
const pool = require('./db');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const stream = require('stream');  // stream 모듈 가져오기

// multer 미들웨어 사용
const multer = require('multer');
const fsUpper = require('fs');
const path = require('path');

//const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // fs.promises를 사용하여 비동기 파일 작업을 수행합니다.
const util = require('util');
const e = require('express');

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
const readFileAsync = util.promisify(fs.readFile);

// promisify를 사용하여 fs.unlink를 비동기 함수로 변환
// const unlinkAsync = util.promisify(fs.unlink);
const unlinkSync = fs.unlink;

// 동적요청에 대한 응답을 보낼때 etag 를 생성하지 않도록
app.set('etag', false);

// 정적요청에 대한 응답을 보낼때 etag 생성을 하지 않도록
const options = { etag : false };

//값이 없으면 null로 세팅
const defaultNull = (value) => value === undefined ? null : value;


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
// app.post('/login', async(req, res) => {
//     const {username, password} = req.body;
//     try{
//         //const users = await pool.query('SELECT * FROM user_account WHERE email = $1', [username]);
//         //if(!users.rows.length) return res.json({message:'Invalid email or password'});
//         const adminUserId = 'admin';
//         const adminPassword = '$2b$10$smDUBTdRbt6bnzwIcQkoX.MJgaD21lIxoT9AgE1zW2/EYUROUDlnG';

//         if (adminUserId !== username ){
//             res.json({message:"Invalid email or password"});
//             return;
//         }

//         const success = await bcrypt.compare(password, adminPassword);
//         const token = jwt.sign({email}, 'secret', {expiresIn:'1hr'});
//         if(success){
//             res.json({'userId' : 'admin','userName' : 'adiministrator', token});
//         }else{
//             res.json({message:"Invalid email or password"});
//         }
//         res.end();
//     }catch(err){
//         console.error(err);
//         res.json({message:err});        
//         res.end();
//     }
// });

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
    try{
        
        const users = await pool.query('SELECT user_id, user_name, password FROM tbl_user WHERE user_name = $1', [username]);
        if(!users.rows.length) return res.json({message:'Invalid userName or password'});
   
        // security_group_admin 있는 사람만 로그인 
        const exist_secu_group = await pool.query(`select security_group_name 
        from tbl_security_group_admin
        where security_group_admin_name = $1
        and security_group_admin_start_date <= CURRENT_DATE
        and (security_group_admin_end_date is null or security_group_admin_end_date >= CURRENT_DATE)`, [username]);

        if(!exist_secu_group.rows.length) return res.json({message:'No Security Admin'});


        // alogrithm 
        const algorithm = process.env.CRYPTO_ALGORITHM;
        // key 
        let key = Buffer.alloc(32);
        Buffer.from(process.env.CRYPTO_PASSWORD).copy(key);

        // 초기화 벡터를 직접 정의 (16바이트 길이의 버퍼)
        let iv = Buffer.alloc(16);
        Buffer.from(process.env.CRYPTO_IV).copy(iv);
        
        const cipher = crypto.createCipheriv(algorithm, key, iv); 

        let passwordComapre = cipher.update(password, 'utf8', 'base64');

        passwordComapre += cipher.final('base64');

        if(passwordComapre === users.rows[0].password) {
            const token = jwt.sign({username}, 'secret', {expiresIn:'1hr'});
            res.json({'userId' : username,'userName' : username, token});
        }else{
            res.json({message:"Invalid userName or password"});
        }

        res.end();
    }catch(err){
        console.error(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/passwordChange', async(req, res) => {
    const {username, old_password, new_password} = req.body;
    try{
        const users = await pool.query('SELECT user_id, user_name, password FROM tbl_user WHERE user_name = $1 ', [username]);
        if(!users.rows.length) return res.json({message:'Invalid userName'});
   

        // alogrithm 
        const algorithm = process.env.CRYPTO_ALGORITHM;
        // key 
        let key = Buffer.alloc(32);
        Buffer.from(process.env.CRYPTO_PASSWORD).copy(key);

        // 초기화 벡터를 직접 정의 (16바이트 길이의 버퍼)
        let iv = Buffer.alloc(16);
        Buffer.from(process.env.CRYPTO_IV).copy(iv);
        
        const cipherOld = crypto.createCipheriv(algorithm, key, iv); 

        let oldPassword = cipherOld.update(old_password, 'utf8', 'base64');
        oldPassword += cipherOld.final('base64');

        //입력한 패스워드와 db저장됨 패스워드가 같다면, 패스워드 변경
        if ( users.rows[0].password !== oldPassword){
            return  res.json({message:'Invalid userName or password'});
        }

        const cipherNew = crypto.createCipheriv(algorithm, key, iv); 
        let newPassword = cipherNew.update(new_password, 'utf8', 'base64');
        newPassword += cipherNew.final('base64');

        const response = await pool.query(`
                    update tbl_user 
                        set password    = $1
                        where user_name = $2
                `,[newPassword,  username]);

        res.json({'userId' : username,'userName' : username});
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
            original_job_id   as "originaJobId" 
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
        sendTimeTo,
        privacyText,
        currentUserName } = req.body;
    const transferDetectprivacy = detectPrivacy? true:null;    

    const isPrivacyText = privacyText? true:false;
    const v_sendTimeFrom = sendTimeFrom.substr(0,6)+'000000';
    const v_sendTimeTo = sendTimeTo.substr(0,6)+'235959';

    //console.log('getauditjob Input Value : ', userName, detectPrivacy, v_sendTimeFrom, v_sendTimeTo, privacyText);
    try{

        // currentUserName -> security group list  찾기 
        // => 해당 security group list 가 포함된  job log  조회 

        if ( detectPrivacy === true &&  isPrivacyText === true){
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
                    original_job_id   as "originaJobId",
                    'ImageLog\\'||image_archive_path as "imageArchivePath",
                    'ImageLog\\'||text_archive_path as "textArchivePath"
                from tbl_audit_job_log
                where user_name like '%'||$1||'%' 
                  and send_time >= $2
                  and send_time <= $3
                  and detect_privacy = $4
                  and privacy_text like '%'||$5||'%' 
                  and security_group_name in 
                        (select security_group_name 
                            from tbl_security_group_admin
                            where security_group_admin_name = $6
                            and security_group_admin_start_date <= CURRENT_DATE
                            and (security_group_admin_end_date is null or security_group_admin_end_date >= CURRENT_DATE)
                        )
                order by send_time desc`,
                [userName, v_sendTimeFrom, v_sendTimeTo,detectPrivacy, privacyText, currentUserName]
            ) ;
            res.json(auditJob.rows);
            res.end();
        }else if ( detectPrivacy === true &&  isPrivacyText === false){
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
                original_job_id   as "originaJobId",
                'ImageLog\\'||image_archive_path as "imageArchivePath",
                'ImageLog\\'||text_archive_path as "textArchivePath"
            from tbl_audit_job_log
            where user_name like '%'||$1||'%' 
              and send_time >= $2
              and send_time <= $3
              and detect_privacy = $4
              and security_group_name in 
                (select security_group_name 
                    from tbl_security_group_admin
                    where security_group_admin_name = $5
                    and security_group_admin_start_date <= CURRENT_DATE
                    and (security_group_admin_end_date is null or security_group_admin_end_date >= CURRENT_DATE)
                )              
            order by send_time desc`,
            [userName, v_sendTimeFrom, v_sendTimeTo,detectPrivacy, currentUserName]
            ) ;
            res.json(auditJob.rows);
            res.end();
        }else if ( detectPrivacy === false &&  isPrivacyText === true){
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
                original_job_id   as "originaJobId",
                'ImageLog\\'||image_archive_path as "imageArchivePath",
                'ImageLog\\'||text_archive_path as "textArchivePath"
            from tbl_audit_job_log
            where user_name like '%'||$1||'%' 
              and send_time >= $2
              and send_time <= $3
              and privacy_text like '%'||$4||'%' 
              and security_group_name in 
                        (select security_group_name 
                            from tbl_security_group_admin
                            where security_group_admin_name = $5
                            and security_group_admin_start_date <= CURRENT_DATE
                            and (security_group_admin_end_date is null or security_group_admin_end_date >= CURRENT_DATE)
                        )
            order by send_time desc`,   
            [userName, v_sendTimeFrom, v_sendTimeTo, privacyText, currentUserName]
            );
            res.json(auditJob.rows);
            res.end();           
        }else{
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
                original_job_id   as "originaJobId",
                'ImageLog\\'||image_archive_path as "imageArchivePath",
                'ImageLog\\'||text_archive_path as "textArchivePath"
            from tbl_audit_job_log
            where user_name like '%'||$1||'%' 
              and send_time >= $2
              and send_time <= $3
              and security_group_name in 
                        (select security_group_name 
                            from tbl_security_group_admin
                            where security_group_admin_name = $4
                            and security_group_admin_start_date <= CURRENT_DATE
                            and (security_group_admin_end_date is null or security_group_admin_end_date >= CURRENT_DATE)
                        )
            order by send_time desc`,
            [userName, v_sendTimeFrom, v_sendTimeTo, currentUserName]
            );
            res.json(auditJob.rows);
            res.end();   
            /**
                $4||'/ImageLog/'||image_archive_path as "imageArchivePath",
                $4||'/ImageLog/'||text_archive_path as "textArchivePath"
             */
        }
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/getPdf', async (req, res) => {
    const { jobLogId } = req.jobLogId;

    try {
        const auditJob = await pool.query(` 
            select file_name as "fileName",
                job_image_file as "jobImageFile"
            from tbl_audit_job_log
            where job_log_id = $1
            and job_image_file is not null`,
            [jobLogId]
            );
            if (auditJob.rows.length > 0) {
                const pdf = auditJob.rows[0];
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${pdf.fileName}`);
                res.send(pdf.jobImageFile);
                res.end(); 
            }else{
                res.json({message:'no pdf files'});  
            }
    } catch (err) {
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

// query personal info regExpression
app.get('/getPersonalRegEx', async(req, res) => {
    try{
        const personalRegEx = await pool.query(` 
            select id as "regExId",
            regex_name as "RegexName",
            regex_value as "RegexValue"
            from tbl_personal_info_regex`);
        res.json(personalRegEx.rows);
        res.end();
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

// add/update/delete personal info regExpression
app.post('/modifyPersonalRegEx', async(req,res) => {
    const { 
          actionType, 
          regexName,
          regexValue,
          modifyUser } = req.body;
    
    try{
        if(actionType === 'ADD'){

        }else if(actionType === 'UPDATE'){

        }else if(actionType === 'DELETE'){

        }
        
        const out_regexName = regexName;
        const out_create_user = actionType === 'ADD' ? modifyUser : "";
        const out_create_date = actionType === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modifyUser;
        
        res.json({ out_regexName: out_regexName,  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
    }catch(err){
        console.error(err);
        res.json({message:err.message});
        res.end();              
    }
});

//보안그룹 쿼리 
app.post('/getSecurityGroup', async(req, res) => {
    const { 
        username } = req.body;
    try{

        if (username === 'admin' || username === 'administrator') {
            // security_group_name이 'ADMIN'인 경우: username에 상관없이 모든 데이터를 조회

            const allData = await pool.query(`
                select security_group_id, security_group_name
                from tbl_security_group
            `);
            res.json(allData.rows);
        }else{
            const securityGroup = await pool.query(` 
            select b.security_group_id , b.security_group_name
            from tbl_security_group_admin a, tbl_security_group b
            where a.security_group_admin_name = $1
            and a.security_group_name = b.security_group_name
            and a.security_group_admin_start_date <= CURRENT_DATE
            and (a.security_group_admin_end_date is null or a.security_group_admin_end_date >= CURRENT_DATE)
            order by b.security_group_name`,[username]);

            res.json(securityGroup.rows);
        }        

   
        res.end();
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/modifySecurityGroup', async(req, res) => {
    const {
        action_type, 
        security_group_name,
        security_group_memo,
        modify_user } = req.body;
    try{

        if (modify_user === 'admin' || modify_user === 'administrator') {
        }else{
            console.log('Not Admin');
            return res.json({message:'Not Admin'});
        }        

        if(action_type === 'ADD'){

            const dupCheck = await pool.query(`SELECT security_group_name 
                                                FROM tbl_security_group 
                                                WHERE security_group_name = $1`, [security_group_name]);
            if(!dupCheck.rows.length){
            }else{
                return res.json({message:'Duplicate Security Group'});
            }

            const securityGroup = await pool.query(` 
            insert into tbl_security_group( security_group_name, security_group_memo)
            values( $1, $2)`,[security_group_name,security_group_memo ]);            
        }
        if(action_type === 'DELETE'){
            // admin 과 dept가 존재하면 삭제 금지
            const adminCheck = await pool.query(`SELECT security_group_name 
                                                FROM tbl_security_group_admin a
                                                WHERE security_group_name = $1
                                                and a.security_group_admin_start_date <= CURRENT_DATE
                                                and (a.security_group_admin_end_date is null or a.security_group_admin_end_date >= CURRENT_DATE)`, [security_group_name]);
            if(!adminCheck.rows.length){
            }else{
                return res.json({message:'exists Security Group Admin'});
            }

            const deptCheck = await pool.query(`SELECT security_group_name 
                                                    FROM tbl_dept_info 
                                                    WHERE security_group_name = $1`, [security_group_name]);
            if(!deptCheck.rows.length){
            }else{
            return res.json({message:'exists Security Group Dept'});
            }

            const securityGroup = await pool.query(` 
                delete from tbl_security_group
                where security_group_name = $1`,[security_group_name]);

            // tbl_security_group_admin 도 함꼐 삭제 .. 앞에서 security_group_admin 체크를 하기 떄문에, 여기에 남아 있는 것들은 end_date 지난 것들
            const securituyGroupAdmin = await pool.query(` 
            delete from tbl_security_group_admin
            where security_group_name = $1`,[security_group_name]);

        }

        res.json({ message:'success' }); // 결과 리턴을 해 줌 .  

    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }

});

//보안그룹 admin 쿼리 
app.post('/getSecurityGroupAdmin', async(req, res) => {
    const { 
        security_group_name } = req.body;
    try{
        const securityGroup = await pool.query(` 
        SELECT 
            a.security_group_name, 
            a.security_group_admin_name, 
            b.full_name, 
            c.dept_name AS department
        FROM 
            tbl_security_group_admin a
        JOIN 
            tbl_user b 
            ON a.security_group_admin_name = b.user_name
        LEFT JOIN 
            tbl_dept_info c 
            ON b.dept_id = c.dept_id
        WHERE 
            a.security_group_name = $1
            AND a.security_group_admin_start_date <= CURRENT_DATE
            AND (a.security_group_admin_end_date IS NULL OR a.security_group_admin_end_date >= CURRENT_DATE)`,[security_group_name]);
        res.json(securityGroup.rows);
        res.end();
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/modifySecurityGroupAdmin', async(req, res) => {
    const {
        action_type, 
        security_group_name, 
        security_admin_name,
        modify_user } = req.body;

    try{        
        if(action_type === 'ADD'){

            const dupCheck = await pool.query(`SELECT security_group_name 
                                                FROM tbl_security_group_admin a 
                                                WHERE a.security_group_name = $1
                                                and a.security_group_admin_name = $2
                                                and a.security_group_admin_start_date <= CURRENT_DATE
                                                and (a.security_group_admin_end_date is null or a.security_group_admin_end_date >= CURRENT_DATE)`, [security_group_name, security_admin_name]);
            if(!dupCheck.rows.length){
            }else{
                return res.json({message:'Duplicate Security Group Admin'});
            }


            const securityGroup = await pool.query(` 
            insert into tbl_security_group_admin(  security_group_admin_name,security_group_admin_start_date, security_group_name )
            values(   $1, CURRENT_DATE, $2)`,[security_admin_name,security_group_name ]);            
        }
        if(action_type === 'DELETE'){
            const securityGroup = await pool.query(` 
                delete from tbl_security_group_admin
                where security_group_name = $1
                and security_group_admin_name = $2`,[security_group_name, security_admin_name]);
        }

        res.json({ message:'success' }); // 결과 리턴을 해 줌 .  

    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }

});

//보안그룹 dept 쿼리 
app.post('/getSecurityGroupDept', async(req, res) => {
    const { 
        security_group_name } = req.body;
    try{
        const securityGroup = await pool.query(` 
        select b.security_group_name, b.dept_id, b.dept_name 
            from tbl_dept_info b
            where b.security_group_name = $1`,[security_group_name]);
        res.json(securityGroup.rows);
        res.end();
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/modifySecurityGroupDept', async(req, res) => {
    const {
        action_type, 
        security_group_name, 
        security_dept_name,
        modify_user } = req.body;

    try{
           
        if(action_type === 'ADD'){

            const dupCheck = await pool.query(`SELECT security_group_name 
                                                FROM tbl_dept_info 
                                                WHERE security_group_name = $1
                                                and dept_name = $2`, [security_group_name, security_dept_name]);
            if(!dupCheck.rows.length){
            }else{
                return res.json({message:'Duplicate Security Group Dept'});
            }

            const securityGroup = await pool.query(` 
                update tbl_dept_info
                set security_group_name = $1
                where dept_name = $2`,[security_group_name, security_dept_name]);
        }
        if(action_type === 'DELETE'){
          
            const securityGroup = await pool.query(` 
                update tbl_dept_info
                   set security_group_name = null
                where dept_name = $1`,[security_dept_name]);  // security_group_name을 null 로 update
        }

        res.json({ message:'success' }); // 결과 리턴을 해 줌 .  

    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }

});

app.post('/getUsers', async(req, res) => {
    try{
        const users = await pool.query(` 
        select  b.user_name, b.full_name , a.dept_name department, deleted_date
        FROM tbl_user b LEFT JOIN tbl_dept_info a
          ON b.dept_id = a.dept_id
        WHERE b.deleted_date IS NULL
        ORDER BY b.full_name;`,[]);
        res.json(users.rows);
        res.end();
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});

app.post('/getDepts', async(req, res) => {
    try{
        const users = await pool.query(` 
        select  dept_id, dept_name, security_group_name
        from tbl_dept_info
        order by dept_name`,[]);
        res.json(users.rows);
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


// query personal info regex
app.get('/getAllRegex', async(req, res) => {
    try{
        const auditJob = await pool.query(` 
            select regex_name ,
            regex_value ,
            modify_user 
            from tbl_personal_info_regex`);
        res.json(auditJob.rows);
        res.end();
    }catch(err){
        console.log(err);
        res.json({message:err});        
        res.end();
    }
});


// modify personal info regex
app.post('/modifyRegex', async(req, res) => {
    const  { 
        action_type                = defaultNull(req.body.action_type),
        regex_name         = defaultNull(req.body.regex_name),
        regex_value         = defaultNull(req.body.regex_value),
        modify_user        = defaultNull(req.body.modify_user)
    } = req.body;


    try{
        const current_date = await pool.query(`select to_char(now(),'YYYY.MM.DD HH24:MI:SS') currdate`);
        const currentDate = current_date.rows[0];

        if (action_type === 'ADD') {
            const response = await pool.query(`insert into tbl_personal_info_regex(
                regex_name  ,
                regex_value  ,
                create_user ,
                creation_date,
                modify_user , 
                modify_date    )
                values($1,$2,$3,$4::timestamp,$5,$6::timestamp)`,
                [
                    regex_name  ,
                    regex_value ,
                    modify_user ,
                    currentDate.currdate,
                    modify_user,
                    currentDate.currdate
                ]
            );       
        }
        if (action_type === 'UPDATE') {
            const response = await pool.query(`
            update tbl_personal_info_regex 
                set  regex_value  = COALESCE($1 , regex_value) ,
                modify_user = COALESCE($2 , modify_user) ,
                modify_date   = COALESCE($3 , modify_date) 
            where regex_name = $4`,
                [
                    regex_value  ,
                    modify_user ,
                    currentDate.currdate,
                    regex_name
                ]
            );       
        }
        if (action_type === 'DELETE') {
            const response = await pool.query(`
           delete from tbl_personal_info_regex 
            where regex_name = $1`,
                [
                    regex_name
                ]
            );       
        }

        const out_create_user = action_type === 'ADD' ? modify_user : "";
        const out_create_date = action_type === 'ADD' ? currentDate.currdate : "";
        const out_modify_date = currentDate.currdate;
        const out_recent_user = modify_user;
        
        res.json({ message:'success',  out_create_user:out_create_user, 
           out_create_date:out_create_date, out_modify_date:out_modify_date, out_recent_user:out_recent_user }); // 결과 리턴을 해 줌 .  
   
    }catch(err){
        console.error(err);
        res.json({message:err.message});   
        res.end();              
    }
});

app.post('/decryptoFile', async (req, res) => {
    const  { 
        filepath            
    } = req.body;

    try {
        // console.log('decryptoFile...', filepath);
        const algorithm = process.env.CRYPTO_ALGORITHM;
        const encryptedFilePath = path.join(filepath);

        let key = Buffer.alloc(32);
        Buffer.from(process.env.CRYPTO_PASSWORD).copy(key);

        if (fsUpper.existsSync(encryptedFilePath)) {
            
            //const base64Data = fsUpper.readFileSync(encryptedFilePath, 'utf8'); // 파일을 메모리로 읽어오기 (Base64 데이터)
            
            // Base64 디코딩
            //const encryptedData = Buffer.from(base64Data, 'base64');
            const encryptedData = fsUpper.readFileSync(encryptedFilePath); 

            // 첫 16바이트는 IV로 사용
            let iv = Buffer.alloc(16);
            Buffer.from(process.env.CRYPTO_IV).copy(iv);

            

            // 복호화 스트림 생성
            const decipher = crypto.createDecipheriv(algorithm, key, iv);
            decipher.setAutoPadding(true);  // PKCS7 패딩 사용

            const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

            // 복호화된 데이터를 파일로 저장
            //fsUpper.writeFileSync(decryptedFilePath, decryptedData);

            //console.log('복호화 완료: ', decryptedFilePath);
            //res.send('파일 복호화 완료');
            
            res.setHeader('Content-Disposition', 'attachment; filename="decrypted.PDF"');
            res.setHeader('Content-Type', 'application/pdf');  // 파일 형식에 따라 변경 가능
            
            res.send(decryptedData);  // 복호화된 데이터를 직접 전송

        } else {
            res.status(404).send('파일을 찾을 수 없습니다.');
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
});


// crypto encryption file Test 
app.get('/encryptoFile', async(req, res) => {
    try{
        const algorithm = process.env.CRYPTO_ALGORITHM;

        const filePath = path.join('ImageLog', '2023', '09', '1.pdf');
        let buffer ;
        if (fsUpper.existsSync(filePath)) {
            console.log('Reading file...');
            // buffer = await  readFileAsync(filePath);
            
            //fsUpper.createReadStream(filePath).pipe(res);
            const readStream = fsUpper.createReadStream(filePath);
            console.log('File read successfully.');

            const encryptedFilePath = path.join('ImageLog', '2023', '09', '1.pdf');
            const writeStream = fsUpper.createWriteStream(encryptedFilePath);

            let key = Buffer.alloc(32);
            Buffer.from(process.env.CRYPTO_PASSWORD).copy(key);

            // 초기화 벡터를 직접 정의 (16바이트 길이의 버퍼)
            let iv = Buffer.alloc(16);
            Buffer.from(process.env.CRYPTO_IV).copy(iv);
            //const iv = crypto.randomBytes(16); //초기화 벡터. 더 강력한 암호화를 위해 사용. 랜덤값이 좋음

            const cipher = crypto.createCipheriv(algorithm, key, iv); 

            
            // 파일을 읽어서 암호화하고 Base64로 변환

            let encryptedData = Buffer.alloc(0);

            readStream.on('data', (chunk) => {
                encryptedData = Buffer.concat([encryptedData, cipher.update(chunk)]);
            });

            readStream.on('end', () => {
                // 암호화 종료
                encryptedData = Buffer.concat([encryptedData, cipher.final()]);

                // 암호화된 데이터를 Base64로 변환
                const encryptedBase64 = encryptedData.toString('base64');

                // Base64로 인코딩된 암호화 데이터를 파일에 저장
                writeStream.write(encryptedBase64);
                writeStream.end();

                console.log('암호화 및 Base64 변환 후 파일 저장 완료:', encryptedFilePath);
                res.send('파일 암호화 및 Base64 저장 완료');
            });

            readStream.on('error', (err) => {
                console.error('파일 읽기 중 오류 발생:', err);
                res.status(500).send('파일 처리 중 오류 발생');
            });

            writeStream.on('error', (err) => {
                console.error('파일 쓰기 중 오류 발생:', err);
                res.status(500).send('파일 쓰기 중 오류 발생');
            });          


        } else {
            res.send('파일을 찾을 수 없습니다.');
        }
    }
    
    catch(err){
        console.log(err.message);
        res.send(err.message);
    }
});   

app.listen(PORT, ()=> {
    console.log(`Server running on PORT ${PORT}`);
});