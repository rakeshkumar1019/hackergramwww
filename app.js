var express =require("express");
var nodemailer = require('nodemailer');
var mysql=require("mysql");
var datetime = require('node-datetime');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser=require("body-parser");
var multer = require('multer');
var path=require('path');
var app=express();
app.set('view engine','ejs');
app.use(express.static("css"));
app.use(express.static("uploads"));
app.use(express.static("images"));
app.use(express.static("videos"));
app.use(express.static("js"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

var PORT=process.env.PORT ||8080;

var connection=mysql.createConnection({
host:'localhost',
user:'root',
password:'',
database:'hackergram'
});

connection.connect(function(err){
    if(err) throw err;
    console.log("database is connected");
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port:587,
	secure: false,
	auth: {
	  user: 'srakeshkumar1019@gmail.com',
	  pass: 'rakesh@786G'
	}
  });

  

var storage1 = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'uploads/');
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});

var upload = multer({ storage: storage1 });

app.get("/",function(req,res){
    res.sendFile('index.html',{root:__dirname});
});

app.get("/findme",function(req,res){
    res.sendFile('registration.html',{root:__dirname});
});
// registration


app.post("/submit",function(req,res){
var otp=Math.floor(100000 + Math.random() * 900000);

var user=req.body.username;	
var email=req.body.email;

	var mailOptions = {
		from: 'srakeshkumar1019@gmail.com',
		to:email,
		subject: 'Welcome to Hackergram',
		text: ` Hey ${user}!
${otp} is your Hackergram Verification Code
Please do not share it with anyone.`
		// html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'        
	  };

	  transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		  console.log(error);
		} else {
		  console.log('Email sent: ' + info.response);
		}
	  });



    var noimage = "noimage.png";
    var sql="insert into users values(null,'"+req.body.username+"','"+req.body.email+"','"+req.body.password+"','"+req.body.phone+"')";
     connection.query(sql,function(err){
         if(err) throw err;
         var s = "insert into userprofileimages values('" + noimage + "','" + req.body.email + "')";
         connection.query(s, function (err) {
			 if (err) throw err;
			 
			 var total=0;
			 var sss = "insert into ranks values('" +total+ "','"+req.body.username+"','" + req.body.email + "')";
         connection.query(sss, function (err) {
			 if (err) throw err;
             var verified="false";
			 var verify = "insert into verification values('" + req.body.email + "','" +otp+ "','" +verified+ "')";
			 connection.query(verify, function (err) {
				if (err) throw err;

                res.redirect('/verifyotp');
			
			});  }); 
	    }); 
    }); 
});

app.post("/otp/verification",function(req,res){
var otp=req.body.otp;
connection.query('SELECT * FROM verification WHERE BINARY  otp = ? ', [otp], function (error, results, fields) {
	if (results.length > 0) {
		var verified="true";
		var verify = " UPDATE verification SET verified ='" +verified+ "'  WHERE otp = '" +req.body.otp+ "';";
		connection.query(verify, function (err) {
		   if (err) throw err;
		}); 
		res.redirect('/login');
	
	} else {
		res.send('Wrong verification Code ');
	}
	res.end();

});    
});

app.get("/verifyotp",function(req,res){
    res.render('verifyotp');
});

app.get("/login",function(req,res){
    res.sendFile('login.html',{root:__dirname});
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.post("/auth",function(req,res){
    var email = req.body.email;
	var password = req.body.password;
	

	if (email && password) {
		connection.query('SELECT * FROM users WHERE BINARY  email = ? AND  BINARY  password = ?', [email, password], function (error, results, fields) {
			if (results.length > 0) {

				        req.session.loggedin = true;
				        req.session.email = email;
					
				res.redirect('/dashboard');
				
			} else {
				res.send('Incorrect email and/or Password!');
			}
			res.end();
		});
	} else {
		res.send('Please enter email and Password!');
		res.end();
	}


});
// dashboard
app.get("/dashboard",function(req,res){
    if (req.session.loggedin) {
	var  email=req.session.email ;
	

	var vv="select * from verification where  email='"+email+"' ";
	connection.query(vv,function(err,verfy,fields){
		if (err) throw err;
		 
		if(verfy[0].verified!=="true"){
			res.redirect('/verifyotp');
		}else{	 

    sql="SELECT  * FROM users";
   connection.query(sql,function(err,rows){
    connection.query("SELECT COUNT(*) as total FROM users",function(err,rows1){

        var sq = "select  users.id,users.username,users.phone,users.email,userprofileimages.imagesrc  from users , userprofileimages   where  users.email='" + req.session.email + "' AND userprofileimages.email='" + req.session.email + "'   ";
		connection.query(sq, function (err, results, fields) {
		if (err) throw err;
		rr="select   * from ranks ORDER BY total DESC limit 2 ";
		connection.query(rr, function (err, rank, fields) {
			if (err) throw err;
		cc="SELECT count(*) as total FROM crypto";
		connection.query(cc, function (err, counter, fields) {
			if (err) throw err;
			var summ="SELECT SUM(score) AS points FROM scores where  email='"+req.session.email+"' ";
				    connection.query(summ, function (err, summ, fields) {
					if (err) throw err;			

        res.render('users', { email:email,rows:rows,rows1:rows1[0].total,result: results[0],rank:rank,counter:counter[0].total,summ:summ[0].points});
        }); }); }); });
    });
	});

}

});


    	 
	} else {

		res.redirect('/login');
	}

   
});
app.get("/updateprofileimage",function(req,res){
    if (req.session.loggedin) {
    res.sendFile("updateprofileimage.html",{root:__dirname});
} else {
	res.redirect('/login');
  }
});
app.get("/updateprofile",function(req,res){
	if (req.session.loggedin) {
	res.sendFile("updateprofile.html",{root:__dirname});
} else {
	res.redirect('/login');
  }
});

app.post('/updateprofilephone',function(req,res){
	if (req.session.loggedin) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var phone = req.body.phone;
	var sql="UPDATE users SET phone='"+phone+"' WHERE email='" + req.session.email + "'";
	   connection.query(sql, function (err) {
		if (err) throw err;
		res.redirect('/updateprofile');
	    });

	} else {
		res.redirect('/login');
	  }
});
// updateprofileimage
app.post('/updateprofileimages', upload.single('updateprofileimgage'), function (req, res, next) {
	if (req.session.loggedin) {
		var fileinfo = req.file.filename;
		var s = "select * from  userprofileimages where email='" + req.session.email + "' ";
		connection.query(s, function (error, results, fields) {
			if (results == '') {
				var sql = "insert into userprofileimages values('" + fileinfo + "','" + req.session.email + "')";
				connection.query(sql, function (err) {
					if (err) throw err;
					res.redirect('http://localhost:8080/dashboard');
				});
			} else {
				var fileinfo = req.file.filename;
				sa = "UPDATE userprofileimages  SET imagesrc='" + fileinfo + "' WHERE email='" + req.session.email + "';"
				     connection.query(sa, function (err) {
					if (err) throw err;
					res.redirect('http://localhost:8080/dashboard');
				});
			}
		});
	} else {
      res.redirect('/login');
	}
});


app.get("/logout",function(req,res){
    req.session.loggedin =false;
    res.redirect('/');
});

app.get("/invitecode",function(req,res){
    res.sendFile('invitecode.html',{root:__dirname});
});

app.post("/api/user/invitecode",function(req,res){
    res.send("'mykey':'xzCF16h1TwMImIMZW0gtZGHcJyC4I8Wow8rxYviAtok=','formate:'");
});

app.get("/admin",function(req,res){
    res.sendFile('admin.html',{root:__dirname});
});

app.post("/adminpanel",function(req,res){
    var email = req.body.email;
    var password = req.body.password;
            if (email && password) {
                connection.query('SELECT * FROM admin WHERE  BINARY email = ? AND password = ?', [email, password], function(error, results, fields) {
                    if (results.length > 0) {
                        req.session.loggedin = true;
                        req.session.email = email;
                    
                        res.redirect('/admin/ctf/crypto');
    
                      //  res.render('users',{email:email});
                    } else {
                        res.send('Incorrect Username and/or Password!');
                    }	
                    res.end();		
                   
                });
            } else {
                res.send('Please enter Username and Password!');
               
            }
        
});
app.post('/updateprofileemail',function(req,res){
	if (req.session.loggedin) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var phone = req.body.phone;
	var sql="UPDATE users SET email='"+email+"' WHERE email='" + req.session.email + "'";
	   connection.query(sql, function (err) {
		if (err) throw err;
		res.redirect('/updateprofile');
	    });

	} else {
		res.redirect('/login');
	  }
});
app.post('/updateprofileusername',function(req,res){
	if (req.session.loggedin) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var phone = req.body.phone;
	var sql="UPDATE users SET username='"+username+"' WHERE email='" + req.session.email + "'";
	   connection.query(sql, function (err) {
		if (err) throw err;
		res.redirect('/updateprofile');
	    });

	} else {
		res.redirect('/login');
	  }
});

app.post('/updateprofilepassword',function(req,res){
	if (req.session.loggedin) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var phone = req.body.phone;
	var sql="UPDATE users SET password='"+password+"' WHERE email='" + req.session.email + "'";
	   connection.query(sql, function (err) {
		if (err) throw err;
		res.redirect('/updateprofile');
	    });

	} else {
		res.redirect('/login');
	  }
});

 
app.get("/admin-dashboard",function(req,res){
    if (req.session.loggedin) {
    res.sendFile("/admindash.html",{root:__dirname});
} else {
    
    res.redirect('/admin');
}
})

// app.post("/adminsend",function(req,res){
// var a=req.body.input1;
// var b=req.body.input2;
// var sql="insert into url values('"+a+"','"+b+"')";
//      connection.query(sql,function(err){
//          if(err) throw err;
//          res.send("data submitted");
//      }); 

// });

app.get("/challenge",function(req,res){
    if (req.session.loggedin) {
        var  email=req.session.email ;
        sql="SELECT * FROM users";
       connection.query(sql,function(err,rows){
        connection.query("SELECT COUNT(*) as total FROM users",function(err,rows1){
    
            var sq = "select  users.id,users.username,users.phone,users.email,userprofileimages.imagesrc  from users , userprofileimages   where  users.email='" + req.session.email + "' AND userprofileimages.email='" + req.session.email + "'   ";
            connection.query(sq, function (err, results, fields) {
            if (err) throw err;
            
            res.render('challenge', { email:email,rows:rows,rows1:rows1[0].total,result: results[0]});
           
            });
        });
        });
    
    
             
        } else {
    
            res.redirect('/login');
        }
    
    
});

app.get("/ctf/crypto",function(req,res){
	if (req.session.loggedin) {
	var sql='select * from crypto where type="Cryptography" ';
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		var email=req.session.email;
		var cry="Cryptography";
		var sq="select * from scores where type='"+cry+"' AND email='"+email+"' ";
		connection.query(sq, function (err, resu, fields) {
			if (err) throw err;
			
		res.render('cryptography', {resu: resu,result:result});
		
	   
		});
	});		
	     
} else {
    
	res.redirect('/login');
}
})

app.get("/ctf/sql",function(req,res){
	if (req.session.loggedin) {
	var sql='select * from crypto where type="SQL Injection" ';
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		var email=req.session.email;
		var cry="SQL Injection";
		var sq="select * from scores where type='"+cry+"' AND email='"+email+"' ";
		connection.query(sq, function (err, resu, fields) {
			if (err) throw err;
			
		res.render('sql', {resu: resu,result:result});
		
	   
		});
	});		
	     
} else {
    
	res.redirect('/login');
}
})

app.get("/ctf/xss",function(req,res){
	if (req.session.loggedin) {
	var sql='select * from crypto where type="Cross-site Scripting (XSS)" ';
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		var email=req.session.email;
		var cry="Cross-site Scripting (XSS)";
		var sq="select * from scores where type='"+cry+"' AND email='"+email+"' ";
		connection.query(sq, function (err, resu, fields) {
			if (err) throw err;
			
		res.render('xss', {resu: resu,result:result});
		
	   
		});
	});		
	     
} else {
    
	res.redirect('/login');
}
})

app.get("/ctf/steg",function(req,res){
	if (req.session.loggedin) {
	var sql='select * from crypto where type="Steganography" ';
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		var email=req.session.email;
		var cry="Steganography";
		var sq="select * from scores where type='"+cry+"' AND email='"+email+"' ";
		connection.query(sq, function (err, resu, fields) {
			if (err) throw err;
			
		res.render('steg', {resu: resu,result:result});
		
	   
		});
	});		
	     
} else {
    
	res.redirect('/login');
}
})

app.get("/ctf/foren",function(req,res){
	if (req.session.loggedin) {
	var sql='select * from crypto where type="Cyber forensics " ';
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		var email=req.session.email;
		var cry="Cyber forensics ";
		var sq="select * from scores where type='"+cry+"' AND email='"+email+"' ";
		connection.query(sq, function (err, resu, fields) {
			if (err) throw err;
			
		res.render('foren', {resu: resu,result:result});
		
	   
		});
	});		
	     
} else {
    
	res.redirect('/login');
}
})

app.get("/ctf/network",function(req,res){
	if (req.session.loggedin) {
	var sql='select * from crypto where type="Network Security " ';
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		var email=req.session.email;
		var cry="Network Security";
		var sq="select * from scores where type='"+cry+"' AND email='"+email+"' ";
		connection.query(sq, function (err, resu, fields) {
			if (err) throw err;
			
		res.render('network', {resu: resu,result:result});
		
	   
		});
	});		
	     
} else {
    
	res.redirect('/login');
}
})

app.get("/result",function(req,res){
	if (req.session.loggedin) {
			 var email=req.session.email;
			 
			
			var cry="Cryptography";
			var sq="select * from scores where  email='"+email+"' ";
			connection.query(sq, function (err, resu, fields) {
				if (err) throw err;
				var s="SELECT SUM(score) AS points FROM scores where  email='"+email+"' ";
				    connection.query(s, function (err, summ, fields) {
					if (err) throw err;
					var total=summ[0].points;

					var up="UPDATE ranks SET total='"+total+"' WHERE email='" + req.session.email + "'";
					connection.query(up,function(err,rows){
						 if (err) throw err;
			res.render('result', {resu: resu,summ:summ});
		   
		});
			
		   
	});
		});
				
			 
	} else {
		
		res.redirect('/login');
	}

});

app.post("/ctf/ctf/solution",function(req,res){
	if (req.session.loggedin) {
		var dt = datetime.create();
	var id=parseInt(req.body.id,10);
	 
	var sql='SELECT * FROM crypto WHERE id = ?';
	connection.query(sql,[id] ,function (err, result, fields) {
		if (err) throw err;
		
		var key=req.body.key;
		console.log(key);
		if(result[0].mykey===key){
			console.log(result[0].mykey+" "+key);
		
		var datetime = dt.format('y-m-d H:M:S');
		var score=result[0].point;
		console.log(score);
		var email=req.session.email;
		var id=result[0].id;
		var name=result[0].name;
		var type=result[0].type;
	
			
		var flag=1;
          var s="insert into scores values('"+id+"','"+email+"','"+flag+"','"+score+"','"+type+"','"+name+"','"+datetime+"')";
          connection.query(s,function(req,res){
			  if(err) throw err;
			  console.log("sucessfll");
			  
 			});
		
		}else{
			
			

		}
		
		res.redirect('/result');
	});	

} else {
    
	res.redirect('/login');
}

});

app.get("/admin/ctf/crypto",function(req,res){
	if (req.session.loggedin) {
	res.sendFile("/admincrypto.html",{root:__dirname});
	     
} else {
    
	res.redirect('/login');
}
})


app.post('/admin/ctf/crypto/crypto',function(req,res){
	if (req.session.loggedin) {
		var name = req.body.name;
		var type = req.body.type;
	var description = req.body.description;
	var link = req.body.link;
	var point = req.body.point;
	var level = req.body.level;
	var mykey = req.body.key;
 
	var sql="INSERT INTO crypto values(id,'" + description + "','" + link + "','" + point+ "','" + level + "','" + name+ "','" + mykey+ "','" + type+ "') ";
	   connection.query(sql, function (err) {
		if (err) throw err;
		res.redirect('/admin/ctf/crypto');
	    });

	} else {
		res.redirect('/login');
	  }
});

app.get("/all/crypto",function(req,res){
	if (req.session.loggedin) {
	   
			var sql="select * from crypto";
            connection.query(sql,function(err,cryp,fields){
			if (err) throw err;
			res.render('crypto',{cryp:cryp});    
		});
		
		
	} else {
		res.redirect('/login');
	  }
});

 

app.get("/admin/ctf/sql",function(req,res){
	if (req.session.loggedin) {
	res.sendFile("/adminsql.html",{root:__dirname});
	     
} else {
    
	res.redirect('/login');
}
})
 

app.get("/admin/ctf/xss",function(req,res){
	if (req.session.loggedin) {
	res.sendFile("/adminxss.html",{root:__dirname});
	     
} else {
    
	res.redirect('/login');
}
})
 

app.get("/admin/ctf/steg",function(req,res){
	if (req.session.loggedin) {
	res.sendFile("/adminsteg.html",{root:__dirname});
	     
} else {
    
	res.redirect('/login');
}
})

 

app.get("/admin/ctf/foren",function(req,res){
	if (req.session.loggedin) {
	res.sendFile("/adminforen.html",{root:__dirname});
	     
} else {
    
	res.redirect('/login');
}
})
 


app.get("/admin/ctf/network",function(req,res){
	if (req.session.loggedin) {
	res.sendFile("/adminnetwork.html",{root:__dirname});
	     
} else {
    
	res.redirect('/login');
}
})


app.get("/member",function(req,res){
	if (req.session.loggedin) {
		
		var sql="select * from ranks ORDER BY total ASC";
			connection.query(sql, function (err, ran, fields) {
				if (err) throw err;
	
	            res.render('member',{ran:ran});
});
} else {
    
	res.redirect('/login');
}
});

app.listen(PORT,function(err){
    if(err) throw err;
    console.log(`Server is running at Port:${PORT}`);
})

