export const createQuestion = async (formData) => {
    try {
      const config = useRuntimeConfig(); // Retrieve runtimeConfig settings
      
      // Log to check the data being sent
      console.log("Creating Questions with data:", formData);
      
      // Make fetch request to create questions
      const response = await fetch(
        `${config.public.baseURL}/api/question/create-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
        },
          body: JSON.stringify(formData), // Send the questions array as JSON
        }
      );
  
      // Check the result
      if (response.ok) {
        const data = await response.json();
        console.log("Questions created successfully:", data);
        return { success: true, data }; // Return data on success
      } else {
        const errorData = await response.json();
        console.error("Error creating questions:", errorData);
        return { success: false, error: errorData }; // Return error on failure
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      return { success: false, error: error.message }; // Return error on catch
    }
  };

  export const getQuestionsBySubTopic = async (subTopicId,user_id) => {
    try {
      const config = useRuntimeConfig(); // Retrieve runtimeConfig settings
  
      // Log to check the subTopicId being requested
      console.log("Fetching questions for subTopicId:", subTopicId);
  
      // Make fetch request to get questions
      const response = await fetch(
        `${config.public.baseURL}/api/question/getQuestionsBySubTopic?subTopic_id=${subTopicId}&user_id=${user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Check the result
      if (response.ok) {
        const data = await response.json();
        console.log("Questions fetched successfully:", data);
        return { success: true, data }; // Return data on success
      } else {
        const errorData = await response.json();
        console.error("Error fetching questions:", errorData);
        return { success: false, error: errorData }; // Return error on failure
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      return { success: false, error: error.message }; // Return error on catch
    }
  };
  
  export const clearQuestions = async (subTopicId) => {
    try {
      const config = useRuntimeConfig(); // Retrieve runtimeConfig settings
  
      // Log to check the subTopicId being cleared
      console.log("Clearing questions for subTopicId:", subTopicId);
  
      // Make fetch request to clear questions
      const response = await fetch(
        `${config.public.baseURL}/api/question/clear-questions`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subTopic_id: subTopicId }), // Send subTopic_id as JSON
        }
      );
  
      // Check the result
      if (response.ok) {
        const data = await response.json();
        console.log("Questions cleared successfully:", data);
        return { success: true, data }; // Return data on success
      } else {
        const errorData = await response.json();
        console.error("Error clearing questions:", errorData);
        return { success: false, error: errorData }; // Return error on failure
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      return { success: false, error: error.message }; // Return error on catch
    }
  };


  export const fetchQuestionsWithAnswerByUser = async (subTopicId, userId) => {
    try {
      const config = useRuntimeConfig(); // Retrieve runtimeConfig settings
      
      
      // Make fetch request to create questions
      const response = await fetch(
        `${config.public.baseURL}/api/question/getQuestionsWithAnswerByUser/${subTopicId}/user/${userId}`,
        {
          method: "GET",
          
        }
      );
  
      // Check the result
      if (response.ok) {
        const data = await response.json();
        console.log("Questions get successfully:", data);
        return { success: true, data }; // Return data on success
      } else {
        const errorData = await response.json();
        console.error("Error creating questions:", errorData);
        return { success: false, error: errorData }; // Return error on failure
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      return { success: false, error: error.message }; // Return error on catch
    }
  };