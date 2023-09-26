let express=require("express");
let app=express();
let cors=require("cors");

app.use(express.json());
const corsOptions={
    origin:'http://localhost:3000',
    Credentials:true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET","POST","OPTIONS","PUT","PATCH","DELETE","HEAD"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    );
    next();
});
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Node app listening on port ${port}!`));

const {Client}=require("pg");
const client=new Client({
    user:"postgres",
    password:"9jdvGQvhH9dyAvEd",
    database:"postgres",
    port:5432,
    host:"db.guaiczkgmflqvyhohxtq.supabase.co",
    ssl:{rejectUnauthorized:false},
});

client.connect(function(res,error){
console.log(`Connected!!!!`);
});

app.get("/svr/mobiles",function(req,res,next){
    console.log("Inside/users get Api");
   let brand=req.query.brand;
   let RAM=req.query.RAM;
   let ROM=req.query.ROM;
    const query=`SELECT * FROM mobiles`;
    client.query(query,function(err,result){
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        
        if(brand){
            result.rows=result.rows.filter((n)=>brand.includes(n.brand));
        }
        if(RAM){
            result.rows=result.rows.filter((n)=>RAM.includes(n.ram));
        }
        if(ROM){
            result.rows=result.rows.filter((n)=>ROM.includes(n.rom));
        }
    
          res.send(result.rows);
    //client.end();
    });
});

app.get("/svr/name/:name",function(req,res){
    let name=req.params.name;
    let value=[name];
    let sql=`SELECT * FROM mobiles WHERE name=$1`;
    client.query(sql,value,function(err,result){
        if(err) res.send("Error in Database",err);
        else{
        res.send(result.rows);
    //client.end();
    } 
    })
})
app.get("/svr/RAM/:RAM",function(req,res){
    let RAM=req.params.RAM;
    let value=[RAM];
    let sql=`SELECT * FROM mobiles WHERE RAM=$1`;
    client.query(sql,value,function(err,result){
        if(err) res.send("Error in Database",err);
        else{
        res.send(result.rows);
    //client.end();
    } 
    })
})
app.get("/svr/ROM/:ROM",function(req,res){
    let ROM=req.params.ROM;
    let value=[ROM];
    let sql=`SELECT * FROM mobiles WHERE ROM=$1`;
    client.query(sql,value,function(err,result){
        if(err) res.send("Error in Database",err);
        else{
        res.send(result.rows);
    //client.end();
    } 
    })
})

app.get("/svr/brand/:brand",function(req,res){
    let brand=req.params.brand;
    let value=[brand];
    let sql=`SELECT * FROM mobiles WHERE brand=$1`;
    client.query(sql,value,function(err,result){
        if(err) res.send("Error in Database",err.message);
        else{
        res.send(result.rows);
    //client.end();    
    } 
    })
})
app.get("/svr/OS/:OS",function(req,res){
    let OS=req.params.OS;
    let value=[OS];
    let sql=`SELECT * FROM mobiles WHERE OS=$1`;
    client.query(sql,value,function(err,result){
        if(err) res.send("Error in Database",err.message);
        else{
        res.send(result.rows);
    //client.end();    
    } 
    })
})

app.post("/svr/mobiles",function(req,res,next){
    console.log("Inside post of user");
    var values=Object.values(req.body);
    const query=`INSERT INTO mobiles(name,price,brand,RAM,ROM,OS) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(query,values,function(err,result){
        if (err){
            res.status(400).send(err);
        }
        res.send(`insertion successful`);
      //  client.end();
    });
});
app.put("/svr/edit/:name",function(req,res,next){
    console.log("Inside put of user");
    let name=req.params.name; 
    let price=req.body.price;
    let brand=req.body.brand;
    let ram=req.body.ram;
    let rom=req.body.rom;
    let os=req.body.os;
    let values=[price,brand,ram,rom,os,name];
    const query=`UPDATE mobiles SET price=$1,brand=$2,ram=$3,rom=$4,os=$5 WHERE name=$6`;
    client.query(query,values,function(err,result){
        if (err){
            console.log(err);
            res.status(400).send(err);
        }
        res.send(`update successful`);
        //client.end();
    });
});

app.delete("/svr/delete/:name",function(req,res){
    let name=req.params.name;
    let value=[name];
    let sql='DELETE FROM mobiles WHERE name=$1';
    client.query(sql,value,function(err,result){
        if(err)
         console.log("Error in Database");
        else {
    res.send("Successfully deleted.");
        }
        //client.end();
        })
    })
