import { useAuth } from "@/contexts/auth-context";

export function useReports() {
  const { user } = useAuth(); 

  const submitReport = async (formData: any): Promise<boolean> => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("geoLocation", JSON.stringify(formData.geoLocation));

      // 👇 store user details
      data.append("userEmail", user?.email || "");
      data.append("username", user?.username || "");

      formData.images.forEach((img: File) => data.append("images", img));
      (formData.videos || []).forEach((vid: File) => data.append("videos", vid));
      (formData.audioNotes || []).forEach((aud: File) => data.append("audioNotes", aud));

      const res = await fetch("https://people-eye-server.onrender.com/api/reports", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      return result.success;
    } catch (error) {
      console.error("Submit error:", error);
      return false;
    }
  };

  const getUserReports = async (): Promise<any[]> => {
    try {
      const res = await fetch(`http://localhost:5000/api/reports/${user?.email}`);
      return await res.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };

  return { submitReport, getUserReports };
}
