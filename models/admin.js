var Admin = {
  getById: (client, id, callback) => {
      const query =  `
          SELECT * FROM admin WHERE id = '${id}'
      `;
      client.query(query,(req,result)=>{
        callback(result.rows[0]);
      });
    },
  getByEmail: (client, email,callback) => {
    const query =  `
          Select * from admin where email = '${email}'
      `;
      client.query(query,(req,result)=>{
        callback(result.rows[0]);
      });
    },
   getAdminData: (client, id,callback) => {
      const query =  `
          select * from admin where id = '${id.id}'
      `;
      client.query(query,(req,result)=>{
        callback(result.rows);
      });
    }
};
module.exports = Admin;