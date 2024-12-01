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
      administrator : 'Administrator'
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