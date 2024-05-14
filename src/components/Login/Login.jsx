import React, { useContext, useState } from "react";
import UserContext from "../../Context/UserContext";

const Login = () => {
  const [name, setName] = useState("");
  const addUser = useContext(UserContext);

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        Get In!
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-11/12 max-w-5xl  flex justify-center flex-col items-start">
          <h3 className="font-bold text-lg">Welcome!</h3>
          <p className="py-4">Enter your name to get started!</p>
          <div className="modal-action">
            <form method="dialog" className="space-y-2">
              {/* if there is a button in form, it will close the modal */}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
                className="input input-bordered w-full max-w-xs"
              />
              <button
                className="btn btn-outline btn-info"
                onClick={() => addUser(name)}
              >
                I'm in
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Login;
