const express = require('express');

const zod = require('zod');
const {Task} = require('./db/user');
const {authMiddleware} = require('./authmiddleware')
const router = express.Router();

router.get("/all", authMiddleware, async(req,res)=>{
    const userId = req.userId;
    try {
        const tasks = await Task.find({
            userId: userId
        })
        if(tasks){
            return res.status(200).json({tasks});
        }
        
    } catch (error) {
        return res.status(411).json({message:"Error getting all tasks", error})
    }

    
})

const taskBody = zod.object({
    taskname: zod.string(),
    priority: zod.string(),
    status: zod.string()
})

router.post("/add", authMiddleware, async (req,res) =>{
    const {success} = taskBody.safeParse(req.body);
    const userId = req.userId
    if(!success){
        return res.status(411).json({message: "Incorrect inputs"})
    }

    try {
        const task = await Task.create({
            userId: userId,
            taskname: req.body.taskname,
            priority: req.body.priority,
            status: req.body.status
        });
    
        if(task){
            return res.status(201).json({message:"Task create successfully"})
        }
    
    } catch (error) {
        return res.status(411).json({message:"error creating tasks", error})
    }

});

 router.post("/filter",authMiddleware, async(req,res) =>{
    const { status, priority } = req.body;
    const userId = req.userId

    let filteredTasks = await Task.find({
        userId: userId
    });


    // Filtering by status
    if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    // Separate the selected priority tasks
    let selectedPriorityTasks = [];
    let otherTasks = [];

    if (priority) {
        selectedPriorityTasks = filteredTasks.filter(task => task.priority === priority);
        otherTasks = filteredTasks.filter(task => task.priority !== priority);
    } else {
        otherTasks = filteredTasks; // If no priority is selected, consider all filtered tasks as other
    }

    // Combine the selected priority tasks with the others
    const sortedTasks = [...selectedPriorityTasks, ...otherTasks];

    res.json({sortedTasks});


 } );

 router.put("/update", async(req, res)=>{
    const {status, priority, taskId} = req.body;

    try {
        if(status){
            const statusChange = await Task.findOne({
                _id: taskId
            })
            if(statusChange){
                await Task.updateOne({
                    _id: taskId
                },{
                    status : status
                })
    
                return res.status(200).json({message: "Status Updated"})
            }
    
         }
    
         if(priority){
            const priorityChange = await Task.findOne({
                _id: taskId
            })
            if(priorityChange){
                 await Task.updateOne({
                    _id: taskId
                },{
                    status : status
                });
    
                return res.status(200).json({message: "Priority Updated"})
    
                
            }
         }

         return res.status(400).json({ message: "No updates made" });
    } catch (error) {
        return res.status(411).json({message:"Inputs are wrong ", error})
    }

    
 });

 router.delete('/delete', async (req, res) => {
    const { taskId } = req.query;
  
    try {
      const task = await Task.findByIdAndDelete(taskId); // Delete the task by ID
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting task', error });
    }
  });

module.exports = router

