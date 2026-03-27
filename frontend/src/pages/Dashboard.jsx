import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import Loader from '../components/Loader';
import { fetchCourses } from '../services/courses.service';
import { useAuthStore } from '../store/useAuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchCourses();
        setCourses(res.data.courses);
      } catch (error) {
        console.error("Error fetching generic courses", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-dark text-gray-900 dark:text-white pb-20">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Pick up where you left off or explore new topics.</p>
        </header>

        {loading ? (
          <div className="py-20"><Loader className="w-12 h-12 text-brand" /></div>
        ) : (
          <div className="space-y-12">
            
            {/* Horizontal Netflix Style Scroll */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                Recently Added Courses
              </h2>
              
              <div className="relative">
                {/* Scroll Container */}
                <div className="flex gap-6 overflow-x-auto pb-8 pt-4 hide-scrollbar snap-x">
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <div key={course._id} className="snap-start">
                        <CourseCard course={course} />
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 py-10">No courses available currently.</div>
                  )}
                </div>
              </div>
            </section>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
