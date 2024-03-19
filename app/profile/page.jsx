"use client"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";


const MyProfile = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const Router = useRouter();

    const handleEdit = (post) => {
        // Implement handleEdit functionality here
        Router.push(`/update-prompt?id=${post._id}`)
    };

    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure about that!");
        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: 'DELETE'
                });
                const filteredPosts = posts.filter((p) => p._id !== post._id); // Added return statement here
                setPosts(filteredPosts);
            } catch (error) {
                console.log(error);
            }
        }
    };
    

    useEffect(() => {
        const fetchPosts = async () => {
          const response = await fetch(`/api/users/${session?.user.id}/posts`);
          const data = await response.json();
           
          setPosts(data);
        };
    
        if (session?.user.id) fetchPosts();
      }, [session?.user.id]);

    return (
        <Profile
            name="my"
            desc="Welcome to your personalized profile page"
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    );
};

export default MyProfile;
