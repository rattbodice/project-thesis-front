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

  export const getQuestionsBySubTopic = async (subTopicId) => {
    try {
      const config = useRuntimeConfig(); // Retrieve runtimeConfig settings
  
      // Log to check the subTopicId being requested
      console.log("Fetching questions for subTopicId:", subTopicId);
  
      // Make fetch request to get questions
      const response = await fetch(
        `${config.public.baseURL}/api/question/getQuestionsBySubTopic?subTopic_id=${subTopicId}`,
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
  