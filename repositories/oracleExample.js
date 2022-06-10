const {
    oracledb,
    configDB
} = require('../config/oracledb.config');
const logger = require('../config/logger.config');

async function queryExample() {
    let conn

    try {
        conn = await oracledb.getConnection(configDB)

        const result = await conn.execute(
            'select * from mpersona where rownum < 5', {}, {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        )
        console.log(result.rows);
    } catch (err) {
        console.log('Ouch!', err)
    } finally {
        if (conn) { // conn assignment worked, need to close
            await conn.close()
        }
    }

}

async function procedureExample() {

    let conn

    try {
        conn = await oracledb.getConnection(configDB)

        sql = `
        begin 
            OPS$ALEAD11G.BBVLMEX_PERSONAS.PL_CALCULA_RFC(:OTFISJUR,:DSNOMEMP,:DSNOMBRE,:DSAPELL1,:DSAPELL2,:FENACIMI,:RFC,:ERROR); 
        end;
        `;

        const result = await conn.execute(sql, {
            OTFISJUR: '1',
            DSNOMEMP: null,
            DSNOMBRE: 'LEONARD JOSE',
            DSAPELL1: 'MENDOZA',
            DSAPELL2: 'HERNANDEZ',
            FENACIMI: new Date('1991-08-04'),
            RFC: {
                dir: oracledb.BIND_INOUT,
                type: oracledb.STRING
            },
            ERROR: {
                dir: oracledb.BIND_OUT,
                type: oracledb.NUMBER
            }
        });
        console.log(result.outBinds.ERROR);
        console.log(result.outBinds.RFC);

    } catch (err) {
        console.log('Ouch!', err)
    } finally {
        if (conn) { // conn assignment worked, need to close
            await conn.close()
        }
    }

}

async function functionExample() {

    let conn;

    try {
        conn = await oracledb.getConnection(configDB);

        //return varchar
        let sql = `
            BEGIN
                :result := OPS$ALEAD11G.BBVLMEX_PERSONAS.LIMPIA_DSNOMBRE(:WS);
            END;
        `;
        let params = {
            WS: 'LEOnÑAR XX.,#2?    meNDOZA',
            result: {
                type: oracledb.STRING,
                dir: oracledb.BIND_OUT
            }
        };

        let options = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        };


        let result = await conn.execute(sql, params, options);
        console.log(result.outBinds.result);

        //return date
        sql = `
            BEGIN
                :result := OPS$ALEAD11G.PACK_FNSINCONSULTA.F_OBT_FECHA_APERTURA_SINI();
            END;
        `;

        params = {
            result: {
                type: oracledb.DATE,
                dir: oracledb.BIND_OUT
            }
        };

        result = await conn.execute(sql, params, options);
        console.log(result.outBinds.result);

        //return cursor
        sql = `
            BEGIN
                :result := OPS$ALEAD11G.PACK_FNSINCONSULTA.CONS_COBERT_AMPAR(:cdunieco, :cdramo, :estado, :nmpoliza, :situacion, :feconsul);
            END;
        `;

        params = {
            result: {
                type: oracledb.CURSOR,
                dir: oracledb.BIND_OUT
            },
            cdunieco: 1,
            cdramo: 606,
            estado: 'M',
            nmpoliza: 18281,
            situacion: 4,
            feconsul: new Date('2020-10-03')
        };

        options = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            resultSet: true
        };

        result = await conn.execute(sql, params, options);
        let row, outRows = [];
        while ((row = await result.outBinds.result.getRow())) {
            outRows.push(row);
        }
        console.log(outRows);

        for (let outRow of outRows) {
            console.log('Cobertura ' + outRow.ID_COBERTURA);
        }

    } catch (err) {
        console.log('Ouch!', err)
    } finally {
        if (conn) { // conn assignment worked, need to close
            await conn.close()
        }
    }

}

module.exports = {
    queryExample,
    procedureExample,
    functionExample
};