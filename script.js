const preQuery1 = document.getElementById("pre-query1")
const preQuery2 = document.getElementById("pre-query2")
const preQuery3 = document.getElementById("pre-query3")

const queryInput = document.getElementById("xpathQuery")

/*
  Adds event listeners to preQuery buttons to fill the input field with sample XPath queries.
 */
preQuery1.addEventListener("click", () => {
    queryInput.value = "//movieTitle"; // Selects all movie titles
});

preQuery2.addEventListener("click", () => {
    queryInput.value = "/movies/movie[2]/director"; // Selects the director of the second movie
});

preQuery3.addEventListener("click", () => {
    queryInput.value = "/movies/movie[4]/actors/actor"; // Selects all actors from the fourth movie
});

// Function to load and parse an XML file.
const loadXML = (filename) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", filename, false);
    xhttp.send();
    return xhttp.responseXML;
}

// Function to apply an XSLT transformation to the XML document.
// It transforms 'movies.xml' using 'movies.xsl' and displays the output.
const applyXSLT = () => {
    let xml = loadXML("movies.xml");
    let xslt = loadXML("movies.xsl");

    if (window.ActiveXObject || "ActiveXObject" in window) {
        // For old browsers
        let ex = xml.transformNode(xslt);
        document.getElementById("output").innerHTML = ex;
    }else if (document.implementation && document.implementation.createDocument) {
        // For modern browsers
        let xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslt);
        let resultDocument = xsltProcessor.transformToFragment(xml, document);
        document.getElementById("output").appendChild(resultDocument);
    }
}

//  Function to execute an XPath query on 'movies.xml' and display the results.
const queryXML = () => {
    let xml = loadXML("movies.xml"); // Load XML Data
    let query = document.getElementById("xpathQuery").value;    // Get user input XPath query
    let output = document.getElementById("queryOutput");
    output.innerHTML = ""; // Clear results
    const ul = document.createElement("ul");    // Create an unordered list for output

    try {
        // Evaluate XPath query
        let result = xml.evaluate(
            query,
            xml,
            null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE, // Ensure iteration
            null
        );

        let node = result.iterateNext();

        // Loop through nodes
        while (node) {
            // Trim and split textContent by spaces or new lines
            let values = node.textContent.trim().split(/\s{2,}|\n+/).filter(Boolean);

            // Create an <li> for each extracted value
            values.forEach(value => {
                const li = document.createElement("li");
                li.textContent = value;
                ul.appendChild(li);
            });

            node = result.iterateNext();
        }

        output.appendChild(ul);
    } catch (e) {
        output.innerHTML = `<p style="color:red;">Error: ${e.message}</p>`;
    }
};

