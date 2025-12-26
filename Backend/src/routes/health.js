import express from 'express';
import mongoose, { version } from 'mongoose';

const router=express.Router();

/**
 * Health Check Routes
 * 
 * Why separate health routes?
 * - Used by load balancers, monitoring tools (PM2, Docker, K8s)
 * - Should be fast and not require auth
 * - Checks both app and database status
 */

/**
 * @route   GET /api/health
 * @desc    Basic health check - is server running?
 * @access  Public
 */

router.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        message:'Portfolens API is running',
        timestamp:new Date().toISOString(),
    });
});

router.get('/db',(req,res)=>{
    const dbState=mongoose.connection.readyState;

    const states={
        0:'disconnected',
        1:'connected',
        2:'connecting',
        3:'disconnected',
    };

    const isHealthy=dbState===1;

    res.status(isHealthy?200:503).json({
        success:isHealthy,
        database:{
            status:states[dbState],
            name:mongoose.connection.name||"N/A",
            host:mongoose.connection.host||"N/A",
        },
        timestamp:new Date().toISOString(),
    });
});

router.get('/full',(req,res)=>{
    const dbState=mongoose.connection.readyState;
    const isDBHealthy=dbState===1;

    res.status(isDBHealthy?200:503).json({
        success:isDBHealthy,
        service:'portfolens-api',
        version:'1.0.0',
        uptime:process.uptime(),
        memory:process.memoryUsage(),
        database:{
            connceted:isDBHealthy,
            name:mongoose.connection.name||'N/A',
        },
        timestamp:new Date().toISOString(),
    });
});

export default router;
