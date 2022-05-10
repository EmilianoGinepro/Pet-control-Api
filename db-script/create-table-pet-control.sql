USE [pet-control]
GO
/****** Object:  Table [dbo].[alimento]    Script Date: 07/05/2022 09:13:33 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[alimento](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idMascota] [int] NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[fecha_compra] [datetime] NOT NULL,
	[cantidad_diaria] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[control]    Script Date: 07/05/2022 09:13:33 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[control](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idMascota] [int] NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[fecha] [datetime] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mascota]    Script Date: 07/05/2022 09:13:33 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mascota](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idUsuario] [int] NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[especie] [varchar](50) NOT NULL,
	[sexo] [varchar](50) NOT NULL,
	[fecha_nacimiento] [datetime] NULL,
	[peso] [int] NULL,
	[observaciones] [varchar](100) NULL,
	[foto] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[medicamento]    Script Date: 07/05/2022 09:13:33 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[medicamento](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idMascota] [int] NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[fecha_primer_dosis] [datetime] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[pipeta]    Script Date: 07/05/2022 09:13:33 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pipeta](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idMascota] [int] NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[fehca_aplicacion] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuario]    Script Date: 07/05/2022 09:13:33 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[apellido] [varchar](50) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[pwd] [varchar](100) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[vacuna]    Script Date: 07/05/2022 09:13:33 a. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[vacuna](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idMascota] [int] NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[fecha_aplicacion] [datetime] NOT NULL,
	[fehca_siguiente_aplicacion] [datetime] NULL,
	[observaciones] [varchar](100) NULL
) ON [PRIMARY]
GO
