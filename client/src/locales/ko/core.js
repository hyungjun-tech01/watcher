import dateFns from 'date-fns/locale/ko';

const core = {
  dateFns,

  format: {
    date: 'yyyy/M/d',
    time: 'HH:mm',
    dateTime: '$t(format:date) $t(format:time)',
    longDate: 'MM월dd일',
    longDateTime: "MM'월'dd'일 ' HH:mm",
  },

  translation: {
    common: {
      destination: '전송처',
      detectIDInfo: '검출 여부',      
      printingDevice: '출력장비',
      productName: 'Watcher Web',
      copies: '부수',
      pages: '매수',
      detected: '검출 여부',
      detect_result: '검출 결과',
      image: '이미지',
      search: '검색...',      
      workTime: '작업시간',
      users : '사용자',     
      from_1: '',
      from_2: '부터',
      to_1: '',
      to_2: '까지',   
      regex_name:'정규식 이름',
      regex_value:'정규식 값',         
      modify_user:'최근 수정자' ,
      regex_modify:'정규식 수정',
      regex_add:'정규식 추가',
      security_group: '보안그룹',
      dept:'부서',
      administrator : '관리자'
    },
    action:{
      Login: '로그인',
    },
    menu:{
      auditlogview:'Audit Log',
      home:'Home',
      regex:'정규식',
      setting:'설정',
      security_group:'보안그룹',
      change_password:'비밀번호 변경',
    }
  },
};

export default core;