-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2020 at 05:57 AM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hackergram`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`email`, `password`) VALUES
('admin', 'password'),
('admin@gmail.com', 'password');

-- --------------------------------------------------------

--
-- Table structure for table `crypto`
--

CREATE TABLE `crypto` (
  `id` int(4) NOT NULL,
  `description` mediumtext NOT NULL,
  `link` varchar(10000) NOT NULL,
  `point` bigint(10) NOT NULL,
  `level` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `key` varchar(1000) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `crypto`
--

INSERT INTO `crypto` (`id`, `description`, `link`, `point`, `level`, `name`, `key`, `type`) VALUES
(1, 'This first challenge is a starter challenge to get us acquainted with the concept of cryptography and cryptanalysis and is hence very straight forward. We are provided a string of characters that we need to decrypt to obtain the plaintext message\r\nvnzebbgohglbharrqzr', 'http://localhost:8080/admin/ctf/crypto', 50, 'Easy', 'Crypto basics', 'iamrootbutyouneedme', 'Cryptography'),
(2, 'Discription about the challange Discription about the challange Discription about the challangev ', 'http://localhost/phpmyadmin/sql.php?server=1&db=hackergram&table=crypto&pos=0', 100, 'Hard', 'sourav challenge ', 'abcd100', 'Cross-site Scripting (XSS)');

-- --------------------------------------------------------

--
-- Table structure for table `ranks`
--

CREATE TABLE `ranks` (
  `total` bigint(10) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ranks`
--

INSERT INTO `ranks` (`total`, `username`, `email`) VALUES
(0, 'Loop1019', 'rakeshkumarsingh25may@gmail.com'),
(50, 'sourav', 'souravsingh0021@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int(4) NOT NULL,
  `email` varchar(255) NOT NULL,
  `flag` varchar(255) NOT NULL,
  `score` bigint(10) NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `email`, `flag`, `score`, `type`, `name`, `datetime`) VALUES
(1, 'souravsingh0021@gmail.com', '1', 50, 'Cryptography', 'Crypto basics', '2020-01-06 21:34:48');

-- --------------------------------------------------------

--
-- Table structure for table `userprofileimages`
--

CREATE TABLE `userprofileimages` (
  `imagesrc` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userprofileimages`
--

INSERT INTO `userprofileimages` (`imagesrc`, `email`) VALUES
('noimage.png', 'rakeshkumarsingh25may@gmail.com'),
('15783266099131.jpg', 'souravsingh0021@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(4) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` bigint(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `phone`) VALUES
(1, 'Loop1019', 'rakeshkumarsingh25may@gmail.com', 'rakesh@786A', 8466953034),
(2, 'sourav', 'souravsingh0021@gmail.com', '12345', 7978818245);

-- --------------------------------------------------------

--
-- Table structure for table `verification`
--

CREATE TABLE `verification` (
  `email` varchar(255) NOT NULL,
  `otp` int(9) NOT NULL,
  `verified` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `verification`
--

INSERT INTO `verification` (`email`, `otp`, `verified`) VALUES
('rakeshkumarsingh25may@gmail.com', 330866, 'true'),
('souravsingh0021@gmail.com', 153285, 'true');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `crypto`
--
ALTER TABLE `crypto`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ranks`
--
ALTER TABLE `ranks`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `userprofileimages`
--
ALTER TABLE `userprofileimages`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `verification`
--
ALTER TABLE `verification`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `crypto`
--
ALTER TABLE `crypto`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
