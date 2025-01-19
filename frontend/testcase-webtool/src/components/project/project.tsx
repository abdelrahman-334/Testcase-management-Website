"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";


interface User {
  email: string;
  _id: string;
  username: string;
}

interface Project {
  _id: string;
  name: string;
  leader:  {
    id:string,
    username:string
  };
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectUsers, setProjectUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    _id: "",
    name: "",
    leader: {
      id:"",
      username:""
    },
  });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:4000/projects",
            {        credentials: 'include'
            }
        ); // Replace with your API endpoint
        const data = await response.json();
        
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const fetchProjectUsers = async (projectId:string) => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${projectId}/get-users`, {
        credentials: "include",
      });
      const data = await response.json();
      setProjectUsers(data);
    } catch (error) {
      console.error("Failed to fetch project users:", error);
    }
  };

  const handleRemove = async () => {
    try {
      

      const updatedProject = await fetch(
     `http://localhost:4000/projects/${currentProject?._id}/remove-user`,
     {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ email: userEmail }),
       credentials: "include",
     }
   );

   if (updatedProject.ok) {
     setIsRemoveModalOpen(false);
     setCurrentProject(null);
     setUserEmail(""); // Reset email field
   } else {
     alert("Failed to remove user from project");
   }
 } catch (error) {
   alert(`Error removing user:, ${error}`);
 }
  }
  const handleAddUserToProject = async () => {
    if (!userEmail) {
      console.error("Please enter a valid email.");
      return;
    }

    try {
        
         const updatedProject = await fetch(
        `http://localhost:4000/projects/${currentProject?._id}/add-user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
          credentials: "include",
        }
      );

      if (updatedProject.ok) {
        setIsAddUserModalOpen(false);
        setCurrentProject(null);
        setUserEmail(""); // Reset email field
      } else {
        alert("Failed to add user to project");
      }
    } catch (error) {
      alert(`Error adding user:, ${error}`);
    }
  };
  // Handle adding or editing a project
  const handleSaveProject = async () => {
    try {

      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode
        ? `http://localhost:4000/projects/${currentProject?._id}`
        : "http://localhost:4000/projects";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
        credentials: 'include'
      });
      if (response.ok) {
        const res = await response.json();
        console.log(res)
        const updatedProject = res.updatedProject;
        if (isEditMode) {
          setProjects(
            projects.map((project) =>
              project._id === updatedProject._id ? {_id: updatedProject._id, name: updatedProject.name, leader: { id:updatedProject._id, username:project.leader.username}} : project
            )
          );
        } else {
          setProjects([...projects,  {_id: updatedProject._id, name: updatedProject.name, leader: { id:updatedProject._id, username:res.name}}]);
        }

        setIsModalOpen(false);
        setNewProject({ _id: "", name: "", leader: {id:"", username:""} });
        setIsEditMode(false);
        setCurrentProject(null);
      } else {
        console.error("Failed to save project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async (id: string) => {
    try {
      
      const response = await fetch(`http://localhost:4000/projects/${id}`, { method: "DELETE" , credentials: 'include'
      });

      if (response.ok) {
        setProjects(projects.filter((project) => project._id !== id));
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Open the edit modal and set the current project
  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setNewProject(project);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div >
        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsEditMode(false);
            setNewProject({ _id: "", name: "", leader: {id:"", username:""} });
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 m-4"
        >
          + Add Project
        </button>
        
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded shadow-md overflow-hidden">
        {projects.length > 0 ? (
        
          <ul>
            {projects.map((project) => (
             
              <li
                key={project._id}
                className="flex justify-between items-center p-4 border-b"
              >
                <Link href={{pathname:`project/${project._id}`,query: {name: project.name, id:project._id}}}>
                <div>
                  <p className="font-bold">{project.name}</p>
                  <p className="text-sm text-gray-500">Leader: {project.leader.username}</p>
                </div>
                </Link>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                  onClick={() => {
                    setCurrentProject(project);
                    setIsAddUserModalOpen(true)
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                  + Add User to Project
                </button>
                <button
                  onClick={() => {
                    setCurrentProject(project);
                    fetchProjectUsers(project?._id)
                    setIsRemoveModalOpen(true)
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                  - Remove User from Project
                </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-500">No projects found.</p>
        )}
      </div>
      
      {/* Add User Modal */}
        {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">Add User to Project</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter user email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUserToProject}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Project" : "Add Project"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              />
              
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {isEditMode ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*remove user*/}
      {isRemoveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">
            </h2>
            <div className="space-y-4">
              <select
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                >
                <option value="">Remove</option>
                {projectUsers.map((user) => (
                  <option key={user._id} value={user.email}>                    
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsPage;
