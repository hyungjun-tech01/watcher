const core = {
  format: {
    date: 'M/d/yyyy',
    time: 'p',
    dateTime: '$t(format:date) $t(format:time)',
    longDate: 'MMM d',
    longDateTime: "MMMM d 'at' p",
  },

  translation: {
    common: {
      
      copies: 'Copies',   //
      destination: 'Destination',  // 
      detect_result: 'Result',  //
      detected: 'Detected',   //
      detectIDInfo: 'Is Detect',   //  
      from_1: '',  //
      from_2: 'From',     //
      image: 'Image',   //
      pages: 'Pages',   //
      printingDevice: 'Print Device',   //
      productName: 'Watcher Web',  // 
      searchUsers: 'Search users...',  //
      to_1: '',   //
      to_2: 'To',     //
      workTime: 'Work Time',   //
      regex_name:'Reg Expression Name',   //
      regex_value:'Reg Expression value',    //  
      modify_user:'Recently User' ,   //
      regex_modify:'Reg Expression Modify',   //
      regex_add:'Reg Expression Add',         //
      security_group: 'Security Group',
      dept:'Department',
      administrator : 'Administrator',
      security_group_name :'Security Group Name',
      add_security_group :'Add Security Group',
      add_security_admin :'Add Administrator',
      security_admin_name :'Security Admin Name',
      security_group_memo:'Memo',
      add_security_dept : 'Add Department',
      add_security_group_name :'Register a security group. Only security group ADMIN administrator can work.',
      duplicate_security_group:'Duplicate security group name.',
      only_security_group_admin:'Only security group ADMIN administrator can work.',
      exist_security_admin : 'Security group administrator exists. Delete it first.',
      exists_security_dept : 'Security group department exists. Delete it first.',
      no_select_security_group :'First, Select security group.',
      duplicate_security_group_dept : 'Aleady exists department.',
      add_security_admin_text : 'Add administrators who can view documents within the security group',
      please_select:'Please Select',
      duplicate_security_group_admin:'It is already an administrator in that security group.',
      newpassword_missmatch : 'The new passwords do not match.',
    },

    action: {
      Login: 'Log In',
    },
    menu:{
      auditlogview:'Audit Log',
      home:'Home',
      regex:'Regular Expression',
      setting:'Settings',
      security_group:'Security Group',
      change_password:'Change Password',
    }
  },
};

export default core;