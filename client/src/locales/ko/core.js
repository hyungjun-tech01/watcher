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
      administrator : '관리자',
      security_group_name :'보안그룹이름',
      add_security_group :'보안그룹 추가',
      security_group_memo:'메모',
      add_security_dept : '부서 추가',
      add_security_admin :'관리자 추가',
      security_admin_name :'관리자 이름',
      add_security_group_name :'보안그룹을 등록합니다. 보안그룹 ADMIN 관리자만 작업 가능합니다.',
      add_security_dept_text :'보안그룹에 속한 부서를 등록합니다.',
      add_security_admin_text : '보안그룹내 문서를 볼 수 있는 관리자를 추가합니다.',
      duplicate_security_group:'보안그룹 이름이 중복되었습니다.',
      only_security_group_admin:'보안그룹 ADMIN 관리자만 작업 가능합니다.',
      exist_security_admin : '보안 그룹 관리자가 존재합니다. 먼저 삭제하세요',
      exists_security_dept : '보안 그룹 부서가 존재합니다. 먼저 삭제하세요',
      no_select_security_group :'보안그룹을 선택하고 작업하세요.',
      duplicate_security_group_dept : '보안그룹에 부서가 이미 존재합니다.',
      please_select:'선택해 주세요',
      duplicate_security_group_admin:'해당 보안 그룹에 관리자로 이미 있습니다.',
      newpassword_missmatch:'새 패스워드가 서로 맞지 않습니다.',
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