const LiListForPagination = document.getElementById("UlPageList");

if(!window.searchQuery){
  window.searchQuery=""
}
console.log(window.totalPages,window.hasPreviousPage,window.previousPage,window.currentPage,window.hasNextPage,window.nextPage,window.searchQuery);

// pageLinks(window.totalPages);
navPaginationLinks(window.totalPages,window.hasPreviousPage,window.previousPage,window.currentPage,window.hasNextPage,window.nextPage,window.searchQuery);

let page;
let previousPageforpegination

LiListForPagination.addEventListener("click", (e) => {
  e.preventDefault();
  // const pageNUM = e.target.textContent || 1;
   page =  Number(e.target.getAttribute('data-store')) || previousPageforpegination;
   previousPageforpegination = page;
  const searchQueryValue = $("#nameSearch").val().trim() || "";
 
    url ="http://localhost:3000/userAll?searchValue="+searchQueryValue+"&page="+page
      
  
  console.log(url);

  $.ajax({
    type: "GET",
    url: url,

    success: function (response) {
      console.log(response);

      $("#UserTableBody").empty();
      response.users.forEach((element) => {
        const tr = createRow(element);
        $("#UserTableBody").append(tr);
      });
     
      navPaginationLinks(response.totalPages,response.hasPreviousPage,response.previousPage,response.currentPage,response.hasNextPage,response.nextPage,response.searchQuery);

      
    },
  });
});

$("#dataform").validate({
  rules: {
    // photo: "required",
    Name: "required",
    Email: { required: true, email: true },
    Country: "required",
    PhoneNo: {
      required: true,
      maxlength: 10,
    },
  },
  messages: {
    // photo: "please enter profile picture",
    Name: "Please Provide Name",
    Email: {
      required: "please enter email",
      includes: "@ ,. ",
    },
    PhoneNo: "please provide correct number",
    Country: "please provide Country",
    PhoneNo: {
      required: "please enter pass",
      maxlength: "min 10 num",
    },
  },

  submitHandler: function name(form) {
    // console.log("hello");

    form.submit();

    const profile = $("#photo")[0].files[0];
    const Namevalue = $("#Name").val().trim().toLowerCase();
    const Emailvalue = $("#Email").val().trim().toLowerCase();
    const CountryCodevalue = $("#Countrycode").val().trim().toLowerCase();
    const PhoneNOvalue = $("#PhoneNO").val().trim().toLowerCase();

    const phone = "+91 " + PhoneNOvalue;

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
        console.log(response);
        reloadData();
      },
      error: function (xhr, status, error) {
        alert(xhr.responseText);
      },
    });
  },
});

//                                                                         //        delete User

$("#UserTable").on("click", ".deleteUSer", function (e) {
  e.preventDefault();
  var confirmation = confirm("Are you sure you want to delete the user");
  console.log(confirmation);
  if (!confirmation) {
    return;
  }
  const id = $(this).closest("tr").attr("id");
  const data = { _id: id };

  $.ajax({
    type: "DELETE",
    url: "http://localhost:3000/user/delete",
    data: data,
    success: function (response) {
      $(`#${response._id}`).closest("tr").remove();

      reloadData();
    },
  });
});

//                                                        //                edit  user //

$("#UserTable").on("click", ".editDetail", function (e) {
  e.preventDefault();

  $(".editDetail").not(this).prop("disabled", true);

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
                <input
                class="form-control photo"
                type="file"
                id="photoe"
                name="photo"
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
  maxlength="14" value="${phone}"><span id="phoneerr"></span></td>

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

    if (!($("#Namee").val().length > 1)) {
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

    const profilee = $("#photoe")[0].files[0];
    const Namevaluee = $("#Namee").val().trim().toLowerCase();
    const Emailvaluee = $("#Emaile").val().trim().toLowerCase();
    const CountryCodevaluee = $("#Countrycodee").val().trim().toLowerCase();
    const PhoneNOvaluee = $("#PhoneNOe").val().trim().toLowerCase();

    let data = new FormData();
    data.append("profile", profilee);
    data.append("name", Namevaluee);
    data.append("email", Emailvaluee),
      data.append("country", CountryCodevaluee),
      data.append("phone", PhoneNOvaluee);
      data.append("_id", trimedId);
console.log(data);

    $.ajax({
      type: "PUT",
      url: "http://localhost:3000/user/update",
      data: data,
      contentType: false,
      processData: false,
      success: function (response) {
        response._id = response._id.trim();
        const trr = createRow(response);
        $(`#${response._id}`).replaceWith(trr);

        $(".editDetail").prop("disabled", false)

      },
      error: function (xhr, status, error) {
        alert(xhr.responseText);
      },
    });
  });
});

//                                      //                                   search Forss

$("#searchform").submit(function (e) {
  e.preventDefault();

  searchValue = $("#nameSearch").val().trim();

  $.ajax({
    type: "GET",
    url:
      "http://localhost:3000/userAll?searchValue=" +
      encodeURIComponent($("#nameSearch").val()) +
      "&page=1",
    datatypes: "json",
    success: function (response) {
      console.log(response);
      navPaginationLinks(response.totalPages,response.hasPreviousPage,response.previousPage,response.currentPage,response.hasNextPage,response.nextPage,response.searchQuery);
      $("#UserTableBody").empty();

      const array = response.users;
      if (!array.length) {
        const nousertr = ` <div style="width:100%">no user found </div>`;
    $("#UlPageList").empty()

        return $("#UserTableBody").append(nousertr);
      } else {
        array.forEach((row) => {
          const tr = createRow(row);
          $("#UserTableBody").append(tr);
        });

      }
    },
  });
});

// function pageLinks(totalPages) {
//   $("#UlPageList").empty();
  
//   for (let index = 0; index < totalPages; index++) {
//     const lis =
//       `<li class="page-item"><a class="page-link" href="http://localhost:3000/userAll?searchValue="` +
//       encodeURIComponent($("#nameSearch").val()) +
//       `"&page=${index + 1}"  >${index + 1}</a></li>`;
//     $("#UlPageList").append(lis);
//   }
// }


function reloadData() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/userAll?searchValue="+searchQueryValue+"&page="+page,
    success: function (response) {
      console.log(response);
      $("#UserTableBody").empty();
      response.users.forEach((element) => {
        const tr = createRow(element);
        $("#UserTableBody").prepend(tr);
      });
      navPaginationLinks(response.totalPages,response.hasPreviousPage,response.previousPage,response.currentPage,response.hasNextPage,response.nextPage,response.searchQuery);
    },
  });
}

function createRow(response) {
  if (!response.profile) {
    response.profile = "noUser.webp";
  }
  const tr =
    "<tr id=" +
    response._id +
    ">" +
    `<td class="IdDIV" style="width: 40px; overflow:hidden"> <div id="IdDIV" style="width: 40px" ` +
    "title=" +
    response._id +
    `>` +
    response._id +
    `</div></td>
<td class="image">
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

  return tr;
}




function navPaginationLinks(   totalPages,
  hasPreviousPage,
  previousPage,
currentPage,
  hasNextPage,
  nextPage,
  searchQuery) {
    $("#UlPageList").empty()

if (hasPreviousPage) {
  let prevPageLink = ` <li class="page-item ">
  <a class="page-link" data-store=${previousPage} tabindex="-1">Previous</a>
</li>
<li class="page-item"><a class="page-link" data-store=${previousPage} id="${previousPage}">${previousPage}</a></li>`
$("#UlPageList").append(prevPageLink);

} else {
  let prevPageLink =`<li class="page-item disabled">
  <a class="page-link" href="#" tabindex="-1">Previous</a>
  </li>`
  $("#UlPageList").append(prevPageLink);
}

let currentPageLink = ` <li class="page-item active"><a class="page-link" data-store=${currentPage} id="${currentPage}">${currentPage}</a></li>`
$("#UlPageList").append(currentPageLink);

if (hasNextPage) {
  let nextPageLink = ` <li class="page-item"><a class="page-link" data-store=${nextPage} id="${nextPage}">${nextPage}</a></li>
  <li class="page-item">
    <a class="page-link" data-store=${nextPage}>Next</a>
    </li>`
    $("#UlPageList").append(nextPageLink);
} else {
  let nextPageLink = `<li class="page-item disabled">
  <a class="page-link" href="#">Next</a>
</li>`
$("#UlPageList").append(nextPageLink);
}
}