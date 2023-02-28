$("#dataform").validate({
  rules: {
    photo: "required",
    Name: "required",
    Email: "required",
    Country: "required",
    PhoneNo: {
      required: true,
      maxlength: 10,
    },
  },
  messages: {
    photo: "please enter profile picture",
    Name: "Please Provide Name",
    Email: {
      required: "please enter email",
      email: true,
    },
    PhoneNo: "please provide correct number",
    Country: "please provide Country",
    PhoneNo: {
      required: "please enter pass",
      maxlength: "min 10 num",
    },
  },

  submitHandler: function name(form) {
    console.log("hello");

    form.submit();

    const profile = $("#photo")[0].files[0];
    const Namevalue = $("#Name").val().trim().toLowerCase();
    const Emailvalue = $("#Email").val().trim().toLowerCase();
    const CountryCodevalue = $("#Countrycode").val().trim().toLowerCase();
    const PhoneNOvalue = $("#PhoneNO").val().trim().toLowerCase();

    const phone = "+91" + PhoneNOvalue;

    let data = new FormData();
    data.append("profile", profile);
    data.append("name", Namevalue);
    data.append("email", Emailvalue),
      data.append("country", CountryCodevalue),
      data.append("phone", phone);

    // console.log(data);

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/user",
      data: data,
      contentType: false,
      processData: false,
      success: function (response) {
        // console.log({ response });
        const ID = response._id;
        // console.log(ID);
        const tr =
          "<tr id=" +
          ID +
          ">" +
          `<td class="IdDIV" style="width: 40px; overflow:hidden"> <div id="IdDIV" style="width: 40px" ` +
          "title=" +
          ID +
          `>` +
          ID +
          `</div></td>
        <td>
          <div>
          <img
            src="./UploadedImages/${response.profile}"
            alt="img"
            style="width: 60px; height:60px"
            console.log(tr);
            $("#UserTableBody").append(tr);
          },
        });
      });  />
        </div>
        </td>
        <td class="name">${response.name}</td>
        <td  class="email" style="width: 20%;">${response.email}</td>
        <td class="country" style="width: 10%;">${response.country}</td>
        <td class="phone" style="width: 15%;">${response.phone}</td>
        <td style="width: 30%;" id="buttonsforedit">
          <div id="TdButtons">
            <button class="editDetail">Edit</button>
            <button class="deleteUSer">Delete</button>
          </div>
        </td>
      </tr>`;
        // console.log(tr);
        // console.log(tr);
        $("#UserTableBody").prepend(tr);
      },
    });
  },
});

//                                                                         //        delete User

$("#UserTable").on("click", ".deleteUSer", function (e) {
  e.preventDefault();
  const id = $(this).closest("tr").attr("id");
  const data = { _id: id };

  $.ajax({
    type: "DELETE",
    url: "http://localhost:3000/user/delete",
    data: data,
    success: function (response) {
      $(`#${response._id}`).closest("tr").remove();
      //   console.log({response});
    },
  });
});

//                                                        //                edit  user //

$("#UserTable").on("click", ".editDetail", function (e) {
  e.preventDefault();

  const tr = $(this).closest("tr").html();
  const name = $(this).closest("tr").find(".name").html();
  const ImgSrc = $(this)
    .closest("tr")
    .find(".image")
    .find("div")
    .find("img")
    .attr("src");
  const country = $(this).closest("tr").find(".country").html();
  const email = $(this).closest("tr").find(".email").html();
  const phone = $(this).closest("tr").find(".phone").html();
  console.log(ImgSrc);

  const _id = $(this).closest("tr").find(".IdDIV").find("#IdDIV").html();
  const trimedId = _id.trim();
  console.log(tr);
  console.log("ImgSrc", ImgSrc);

  
  
  $(this)
    .closest("tr")
    .html(
      `
            <td
                class="IdDIV"
                  style="width: 40px; overflow:hidden"
                  title="` +
        trimedId +
        `"
                >
                  <div id="IdDIV" style="width: 40px">` +
        trimedId +
        `</div></td>
                <td class="image"><div>
                    <img
                      src="` +
        ImgSrc +
        `"
                      alt="img"
                      style="width: 60px; height:60px"
                    />
                  </div></td>

  <td class="name"><input type="text"
  id="Namee"
  name="Name"
  class="form-control name" value="${name}" >
  <span id="nameerr"></span></td>

  <td class="email" style="width: 20%;">
  <input  type="email"
  name="Email"
  id="Emaile"
  class="form-control email" value="${email}"  ><span id="emailerr"></span></td>

  <td class="country" style="width: 10%;">
  <input  type="text"
  name="Country"
  id="Countrycodee"
  class="form-control country" value="${country}"> <span id="countryerr"></span></td>

  <td class="phone" style="width: 15%;">
  <input type="tel"
  id="PhoneNOe"
  name="PhoneNo"
  class="form-control phone"
  maxlength="13" value="${phone}"><span id="phoneerr"></span></td>

  <td style="width: 30%;" id="buttonsforedit">
  <div id="TdButtons">
    <button type="submit" id="saveButton" class="saveButton">save</button>
   </div>
    </td>
  
 `
    );

  const button = document.getElementById("saveButton");
  const nameerror = document.getElementById("nameerr");
  const emailerr = document.getElementById("emailerr");
  const countryerr = document.getElementById("countryerr");
  const phoneerr = document.getElementById("phoneerr");

  button.addEventListener("click", (e) => {
    e.preventDefault();

    if (!($("#Namee").val().length > 3)) {
      return (nameerror.textContent = "please provide name");
    } else {
      nameerror.textContent = "";
    }

    var re = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if (!re.test($("#Emaile").val())) {
      return (emailerr.textContent = "pleasE valid email Must");
    } else {
      emailerr.textContent = "";
    }


    if (!($("#Countrycodee").val().length > 2)) {
      return (countryerr.textContent = "please provide country");
    } else {
      countryerr.textContent = "";
    }

    const checkPlus = $("#PhoneNOe").val().includes("+");

    if (!(checkPlus && $("#PhoneNOe").val().length > 10)) {
      return (phoneerr.textContent = "phone must + and should be 13");
    } else {
      phoneerr.textContent = "";
    }

    const data = {
      id: trimedId,
      name: $("#Namee").val(),

      email: $("#Emaile").val(),

      country: $("#Countrycodee").val(),
      phone: $("#PhoneNOe").val(),
    };
    // console.log(data);

    $.ajax({
      type: "PUT",
      url: "http://localhost:3000/user/update",
      data: data,
      success: function (response) {
        // console.log({ response });
        response._id= response._id.trim()

        const trr =
          "<tr id=" +
          response._id +
          ">" +
          `<td class="IdDIV" style="width: 40px; overflow:hidden" title="${response._id}" > <div id="IdDIV" style="width: 40px"  
       > 
    ` +
          response._id +
          `
       
        </div></td>
      <td class="image">
      <div>
      <img
        src="./UploadedImages/${response.profile}"
        alt="img"
        style="width: 60px; height:60px"
      />
    </div>
      </td>
      <td class="name">${response.name}</td>
      <td class="email" style="width: 20%;">${response.email}</td>
      <td class="country" style="width: 10%;">${response.country}</td>
      <td class="phone" style="width: 15%;">${response.phone}</td>
      <td style="width: 30%;" id="buttonsforedit">
        <div id="TdButtons">
          <button class="editDetail">Edit</button>
          <button class="deleteUSer">Delete</button>
        </div>
      </td>
    </tr>`;

        // console.log(trr);

        $(`#${response._id}`).replaceWith(trr);
      },
    });
  });
});

//                                      //                                   search Forss

$("#searchform").submit(function (e) {
  e.preventDefault();
  const page = 1;
  const SearchValue = {searchValue:  $("#nameSearch").val() , page: page}
  console.log(SearchValue);

  $.ajax({
    type: "GET",
    url: "http://localhost:3000/users?searchValue=" + encodeURIComponent($("#nameSearch").val()) + "&page=" + page,
    // body: {data:  $("#nameSearch").val() , page: page},
    datatypes:"json",
    success: function (response) {
      $("#UserTableBody tr").remove();
      console.log(response);

      const array = response;
      // console.log(array.length);
      if (!array.length) {
        const nousertr = ` <div style="width:100%">no user found </div>`;
        return $("#UserTableBody").append(nousertr);
      }
      array.forEach((row) => {
        const ID = row._id;

        const tr =
          "<tr id=" +
          ID +
          ">" +
          `<td class="IdDIV" style="width: 40px; overflow:hidden" title="` +
          ID +
          `"> <div id="IdDIV" style="width: 40px" >` +
          ID +
          `</div></td>
          <td class="image">
          <div>
          <img
            src="./UploadedImages/${row.profile}"
            alt="img"
            style="width: 60px; height:60px"
          />
        </div>
          </td>
          <td class="name">${row.name}</td>
          <td class="email" style="width: 20%;">${row.email}</td>
          <td  class="country" style="width: 10%;">${row.country}</td>
          <td class="phone" style="width: 15%;">${row.phone}</td>
          <td  style="width: 30%;" id="buttonsforedit">
            <div id="TdButtons">
              <button class="editDetail">Edit</button>
              <button class="deleteUSer">Delete</button>
            </div>
          </td>
        </tr>`;
        // console.log(tr);
        $("#UserTableBody").append(tr);
      });
    },
  });
});

