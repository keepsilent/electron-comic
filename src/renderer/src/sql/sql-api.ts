import {conDb} from "./index";
export function addTest(type = 1, tel=123, cookie='1', uin='1') {
    let db = conDb();

    let createdTimer = new Date().getTime();

    console.log('v');
    return new Promise((resolve, reject) => {
        let sql = `INSERT INTO test (type, tel, cookie, createdTimer, uin) `;
        sql += `values (${type}, ${tel}, '${cookie}', '${createdTimer}', '${uin}')`;

        console.log('sql',sql);
        db.all(sql,(error,data) => {
            if (error) {
                console.log({code:400,msg:'成功',data});
                reject({code:400,msg:error});
            } else {
                console.log({code:200,msg:'成功',data});
                resolve({code:200,msg:'成功',data});
            }
        });


    })

}

